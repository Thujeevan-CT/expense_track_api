import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './schema/expense.schema';
import { Model, isValidObjectId } from 'mongoose';
import { AddExpenseDto } from './dto/addExpense.dto';
import { UpdateExpenseDto } from './dto/updateExpense.dto';
import {
  allExpensesResponse,
  expenseResponse,
} from './response/expense.response';
import { User } from 'src/user/schema/user.schema';
import { ExpenseCategory } from 'src/expense-category/schema/expense-category.schema';
import * as moment from 'moment';
import { Income } from 'src/income/schema/income.schema';
import { Budget } from 'src/budget/schema/budget.schema';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name)
    private expenseModel: Model<Expense>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(ExpenseCategory.name)
    private expenseCategoryModel: Model<ExpenseCategory>,
    @InjectModel(Income.name)
    private incomeModel: Model<Income>,
    @InjectModel(Budget.name)
    private budgetModel: Model<Budget>,
  ) {}

  async addNewExpense(data: AddExpenseDto, req: any): Promise<any> {
    try {
      const currentTime = moment.utc();
      const inputTime = moment.unix(data.date).utc();
      if (!inputTime.isSameOrBefore(currentTime)) {
        throw new UnprocessableEntityException('Date must be past!');
      }

      const user = this.userModel.findById(req.user.id);
      if (!user) throw new UnprocessableEntityException('User not found!');

      const expenseCategory = this.expenseCategoryModel.findById(
        data.category_id,
      );
      if (!expenseCategory)
        throw new UnprocessableEntityException('Expense category not found!');

      const [incomeData, expenseData] = await Promise.all([
        this.incomeModel.find({
          user: req.user.id,
        }),
        this.expenseModel.find({
          user: req.user.id,
        }),
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

      if (data.amount > currentCash) {
        throw new UnprocessableEntityException(
          'Your current balance is lower than your expense!',
        );
      }

      const budgets = await this.budgetModel.find({
        user: req.user.id,
        category: data.category_id,
        start_date: { $lte: data.date },
        end_date: { $gte: data.date },
      });

      if (budgets && budgets.length >= 1) {
        for (const budget of budgets) {
          await this.budgetModel.findByIdAndUpdate(budget.id, {
            amount: budget.amount - data.amount,
          });
        }
      }

      const expense = await this.expenseModel.create({
        ...data,
        category: data.category_id,
        user: req.user.id,
      });

      const newExpense = await this.expenseModel
        .findById(expense._id)
        .populate(['user', 'category']);

      return {
        message: 'Expense added success.',
        data: expenseResponse(newExpense),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async getExpenses(req: any): Promise<any> {
    try {
      const whereCondition: any = {};
      if (!req.isAdmin) {
        whereCondition.user = req.user.id;
      }

      const expenses = await this.expenseModel
        .find(whereCondition)
        .populate(['user', 'category']);

      return {
        message: 'Expenses retrieved success.',
        data: allExpensesResponse(expenses),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async getSingleExpense(id: string, req: any): Promise<any> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('ID not valid!');
      }

      const expense = await this.expenseModel
        .findOne({ _id: id, user: req.user.id })
        .populate(['user', 'category']);
      if (!expense) {
        throw new UnprocessableEntityException('Expense not found!');
      }
      return {
        message: 'Expense retrieved success.',
        data: expenseResponse(expense),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async updateExpense(id: string, data: UpdateExpenseDto): Promise<any> {
    try {
      if (data.date) {
        const currentTime = moment.utc();
        const inputTime = moment.unix(data.date).utc();
        if (!inputTime.isSameOrBefore(currentTime)) {
          throw new UnprocessableEntityException('Date must be past!');
        }
      }

      if (!isValidObjectId(id)) {
        throw new BadRequestException('ID not valid!');
      }

      const expense = await this.expenseModel.findOne({ _id: id });
      if (!expense) {
        throw new UnprocessableEntityException('Expense not found!');
      }

      if (data.category_id) {
        const expenseCategory = await this.expenseCategoryModel.findById(
          data.category_id,
        );

        if (!expenseCategory) {
          throw new UnprocessableEntityException('Category not found!');
        }
      }

      const updatedExpense = await this.expenseModel
        .findByIdAndUpdate(
          id,
          {
            ...data,
            category: data.category_id ? data.category_id : expense.category,
          },
          { new: true },
        )
        .populate(['user', 'category']);

      return {
        message: 'Expense updated success.',
        data: expenseResponse(updatedExpense),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async deleteExpense(id: string): Promise<any> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('ID not valid!');
      }

      const expense = await this.expenseModel.findOne({ _id: id });
      if (!expense) {
        throw new UnprocessableEntityException('Expense not found!');
      }

      await this.expenseModel.deleteOne({ _id: id });
      return {
        message: 'Expense deleted success.',
        data: {},
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
