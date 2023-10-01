import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, isValidObjectId } from 'mongoose';
import { userUpdateDto } from './dto/userUpdate.dto';
import { userResponse } from 'src/auth/response/user.response';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import { Expense } from 'src/expense/schema/expense.schema';
import { Income } from 'src/income/schema/income.schema';
import { getCurrentDate } from 'src/utils/helpers';
import { getStatsDto } from './dto/getStats.dto';
import { DurationType, Status } from 'src/utils/enums';
import { ExpenseCategory } from 'src/expense-category/schema/expense-category.schema';

type userUpdateType = {
  first_name: string;
  last_name: string;
  password?: number;
  updated_at: string;
};
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(Income.name) private incomeModel: Model<Income>,
    @InjectModel(ExpenseCategory.name)
    private expenseCategoryModel: Model<ExpenseCategory>,
  ) {}

  async getUserProfile(req: any): Promise<any> {
    try {
      const user = await this.userModel.findById(req.user.id);
      if (!user) throw new NotFoundException('User not available!');

      return {
        message: 'User profile retrieved success.',
        user: userResponse(user),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async userUpdate(
    req: any,
    id: string,
    { first_name, last_name, current_password, new_password }: userUpdateDto,
  ): Promise<any> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('ID not valid!');
      }

      const payload = req.user;
      if (id !== payload.id) {
        throw new ForbiddenException('You do not have access permission!');
      }

      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException('User not available!');

      if (current_password && !new_password)
        throw new UnprocessableEntityException('New password is required!');

      if (new_password && !current_password)
        throw new UnprocessableEntityException('Current password is required!');

      let hashedPassword = 0;
      if (new_password && current_password) {
        if (new_password === current_password)
          throw new UnprocessableEntityException('Passwords are same!');

        const isMatchAccount = await bcrypt.compare(
          current_password,
          user.password,
        );

        if (!isMatchAccount) {
          throw new NotFoundException('Current password is incorrect!');
        }

        hashedPassword = await bcrypt.hash(
          new_password,
          Number(process.env.BCRYPT_SALT),
        );
      }

      let finalDataToUpdate: userUpdateType = {
        first_name: first_name ? first_name : user.first_name,
        last_name: last_name ? last_name : user.last_name,
        updated_at: moment.utc().format(),
      };

      if (hashedPassword !== 0) {
        finalDataToUpdate = {
          ...finalDataToUpdate,
          password: hashedPassword,
        };
      }

      const updatedData = await this.userModel.findByIdAndUpdate(
        id,
        finalDataToUpdate,
        { new: true },
      );

      return {
        message: 'User updated success.',
        user: userResponse(updatedData),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async getUserStats(req: any, data: getStatsDto): Promise<any> {
    try {
      const durationType = data.duration_type || DurationType.Day;
      const startDate = moment();
      const endDate = moment().endOf('day').unix();

      if (durationType === DurationType.Month) {
        startDate.startOf('day').subtract(30, 'days');
      } else if (durationType === DurationType.Week) {
        startDate.startOf('day').subtract(7, 'days');
      } else if (durationType === DurationType.Year) {
        startDate.startOf('day').subtract(365, 'days');
      } else {
        startDate.startOf('day');
      }

      const [incomeData, expenseData, expensesCategories] = await Promise.all([
        this.incomeModel.find({
          user: req.user.id,
          date: { $gte: startDate.unix(), $lt: endDate },
        }),
        this.expenseModel.find({
          user: req.user.id,
          date: { $gte: startDate.unix(), $lt: endDate },
        }),
        this.expenseCategoryModel.find({ status: Status.Active }),
      ]);

      const totalOfIncome = incomeData.reduce(
        (total, income) => total + income.amount,
        0,
      );
      const totalOfExpense = expenseData.reduce(
        (total, expense) => total + expense.amount,
        0,
      );

      const currentCash = totalOfIncome - totalOfExpense;
      let monthlyCurrentCash = 0;

      if (durationType !== DurationType.Month) {
        const { startDate: monthlyStartDate, endDate: monthlyEndDate } =
          getCurrentDate(DurationType.Month);

        const [monthlyIncomeData, monthlyExpenseData] = await Promise.all([
          this.incomeModel.find({
            user: req.user.id,
            date: { $gte: monthlyStartDate, $lt: monthlyEndDate },
          }),
          this.expenseModel.find({
            user: req.user.id,
            date: { $gte: monthlyStartDate, $lt: monthlyEndDate },
          }),
        ]);

        const monthlyTotalOfIncome = monthlyIncomeData.reduce(
          (total, income) => total + income.amount,
          0,
        );
        const monthlyTotalOfExpense = monthlyExpenseData.reduce(
          (total, expense) => total + expense.amount,
          0,
        );

        monthlyCurrentCash = monthlyTotalOfIncome - monthlyTotalOfExpense;
      }

      const categoryTotals = [];
      expenseData.forEach((expense) => {
        const { category, amount } = expense;

        const categoryIndex = categoryTotals.findIndex(
          (item) => item.category.toString() === category.toString(),
        );

        if (categoryIndex === -1) {
          const categoryName = expensesCategories.filter(
            (data) => data._id.toString() === category.toString(),
          )[0];
          const categoryTotal = {
            category: category,
            category_name: categoryName.name,
            total: amount,
            percentage: +((amount / totalOfExpense) * 100).toFixed(2),
          };
          categoryTotals.push(categoryTotal);
        } else {
          categoryTotals[categoryIndex].total += amount;
          categoryTotals[categoryIndex].percentage = +(
            (categoryTotals[categoryIndex].total / totalOfExpense) *
            100
          ).toFixed(2);
        }
      });

      const responseData = {
        monthly_current_cash:
          durationType !== DurationType.Month
            ? monthlyCurrentCash
            : Math.max(currentCash, 0),
        current_cash: Math.max(currentCash, 0),
        income_amount: totalOfIncome,
        expense_amount: totalOfExpense,
        expense_Percentages: categoryTotals,
      };

      return {
        message: 'User stats retrieved success.',
        stats: responseData,
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
