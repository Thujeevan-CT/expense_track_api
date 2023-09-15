import * as moment from 'moment';
import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ExpenseCategory } from './schema/expense-category.schema';
import { Model, isValidObjectId } from 'mongoose';
import {
  allExpenseCategoriesResponse,
  expenseCategoryResponse,
} from './response/expenseCategory.response';
import { Status } from 'src/utils/enums';

@Injectable()
export class ExpenseCategoryService {
  constructor(
    @InjectModel(ExpenseCategory.name)
    private expenseCategoryModel: Model<ExpenseCategory>,
  ) {}

  async create(data: CreateExpenseCategoryDto): Promise<any> {
    try {
      const isCategoryNameAvailable = await this.expenseCategoryModel.findOne({
        name: data.name,
      });

      if (isCategoryNameAvailable) {
        throw new UnprocessableEntityException('Category already available');
      }
      const newCategory = await this.expenseCategoryModel.create(data);

      return {
        message: 'New expense category added.',
        data: expenseCategoryResponse(newCategory),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async findAll(req: any): Promise<any> {
    try {
      const whereCondition: any = {};
      if (!req.isAdmin) {
        whereCondition.status = Status.Active;
      }
      const expenseCategories = await this.expenseCategoryModel.find(
        whereCondition,
      );

      return {
        message: 'Expense categories retrieved success.',
        data: allExpenseCategoriesResponse(expenseCategories),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('ID not valid!');
      }
      const expenseCategory = await this.expenseCategoryModel.findOne({
        _id: id,
      });

      if (!expenseCategory) {
        throw new UnprocessableEntityException('Expense not found!');
      }

      return {
        message: 'New expense category added.',
        data: expenseCategoryResponse(expenseCategory),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async update(id: string, data: UpdateExpenseCategoryDto): Promise<any> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('ID not valid!');
      }
      const expenseCategory = await this.expenseCategoryModel.findById(id);

      if (!expenseCategory) {
        throw new UnprocessableEntityException('Expense category not valid');
      }

      const updatedData = await this.expenseCategoryModel.findByIdAndUpdate(
        id,
        { ...data, updated_at: moment.utc().format() },
        { new: true },
      );

      return {
        message: 'Expense category updated.',
        data: expenseCategoryResponse(updatedData),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
