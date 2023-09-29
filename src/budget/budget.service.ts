import * as moment from 'moment';
import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AddBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Budget } from './schema/budget.schema';
import { User } from 'src/user/schema/user.schema';
import { ExpenseCategory } from 'src/expense-category/schema/expense-category.schema';
import { allBudgetResponse, budgetResponse } from './response/budget.response';
import { BudgetType } from 'src/utils/enums';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name)
    private budgetModel: Model<Budget>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(ExpenseCategory.name)
    private expenseCategoryModel: Model<ExpenseCategory>,
  ) {}

  async addNewBudget(data: AddBudgetDto, req: any): Promise<any> {
    try {
      const user = this.userModel.findById(req.user.id);
      if (!user) throw new UnprocessableEntityException('User not found!');

      const expenseCategory = this.expenseCategoryModel.findById(
        data.category_id,
      );
      if (!expenseCategory)
        throw new UnprocessableEntityException('Expense category not found!');

      const startDate = moment.utc().unix();
      const endDate = moment.utc();
      if (data.budget_type === BudgetType.Monthly) {
        endDate.add(30, 'days');
      } else {
        endDate.add(7, 'days');
      }

      const budget = await this.budgetModel.create({
        ...data,
        start_date: startDate,
        end_date: endDate.unix(),
        user: req.user.id,
        category: data.category_id,
      });

      const newBudget = await this.budgetModel
        .findById(budget._id)
        .populate(['user', 'category']);

      return {
        message: 'Budget added success.',
        data: budgetResponse(newBudget),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async getBudgets(req: any): Promise<any> {
    try {
      const whereCondition: any = {};
      if (!req.isAdmin) {
        whereCondition.user = req.user.id;
      }

      const budgets = await this.budgetModel
        .find(whereCondition)
        .populate(['user', 'category']);

      return {
        message: 'Budgets retrieved success.',
        data: allBudgetResponse(budgets),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async getSingleBudget(id: string, req: any): Promise<any> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('ID not valid!');
      }

      const budget = await this.budgetModel
        .findOne({ _id: id, user: req.user.id })
        .populate(['user', 'category']);
      if (!budget) {
        throw new UnprocessableEntityException('Budget not found!');
      }

      return {
        message: 'Budget retrieved success.',
        data: budgetResponse(budget),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async updateBudget(id: string, data: UpdateBudgetDto): Promise<any> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('ID not valid!');
      }

      const budget = await this.budgetModel.findOne({ _id: id });
      if (!budget) {
        throw new UnprocessableEntityException('Budget not found!');
      }

      if (data.category_id) {
        const expenseCategory = await this.expenseCategoryModel.findById(
          data.category_id,
        );

        if (!expenseCategory) {
          throw new UnprocessableEntityException('Category not found!');
        }
      }

      const updatedBudget = await this.budgetModel
        .findByIdAndUpdate(
          id,
          {
            ...data,
            category: data.category_id ? data.category_id : budget.category,
          },
          { new: true },
        )
        .populate(['user', 'category']);

      return {
        message: 'Budget updated success.',
        data: budgetResponse(updatedBudget),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async deleteBudget(id: string): Promise<any> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('ID not valid!');
      }

      const budget = await this.budgetModel.findOne({ _id: id });
      if (!budget) {
        throw new UnprocessableEntityException('Budget not found!');
      }

      await this.budgetModel.deleteOne({ _id: id });
      return {
        message: 'Budget deleted success.',
        data: {},
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
