import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as moment from 'moment';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Income } from './schema/income.schema';
import { Model, isValidObjectId } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { IncomeResponse, allIncomesResponse } from './response/income.response';

@Injectable()
export class IncomeService {
  constructor(
    @InjectModel(Income.name) private incomeModel: Model<Income>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async addNewIncome(data: CreateIncomeDto, req: any): Promise<any> {
    try {
      const currentTime = moment.utc();
      const inputTime = moment.unix(data.date).utc();
      if (!inputTime.isSameOrBefore(currentTime)) {
        throw new UnprocessableEntityException('Date must be past!');
      }

      const user = this.userModel.findById(req.user.id);
      if (!user) throw new UnprocessableEntityException('User not found!');

      const income = await this.incomeModel.create({
        ...data,
        user: req.user.id,
      });

      const newIncome = await this.incomeModel
        .findById(income._id)
        .populate(['user']);

      return {
        message: 'Income added success.',
        data: IncomeResponse(newIncome),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async findAllIncomes(req: any): Promise<any> {
    try {
      const whereCondition: any = {};
      if (!req.isAdmin) {
        whereCondition.user = req.user.id;
      }

      const incomes = await this.incomeModel
        .find(whereCondition)
        .populate(['user']);

      return {
        message: 'Incomes retrieved success.',
        data: allIncomesResponse(incomes),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async getSingleIncome(id: string, req: any): Promise<any> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('ID not valid!');
      }

      const income = await this.incomeModel
        .findOne({ _id: id, user: req.user.id })
        .populate(['user']);
      if (!income) {
        throw new UnprocessableEntityException('Income not found!');
      }
      return {
        message: 'Income retrieved success.',
        data: IncomeResponse(income),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async updateIncome(id: string, data: UpdateIncomeDto): Promise<any> {
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

      const income = await this.incomeModel.findOne({ _id: id });
      if (!income) {
        throw new UnprocessableEntityException('Income not found!');
      }

      const updatedIncome = await this.incomeModel
        .findByIdAndUpdate(id, data, { new: true })
        .populate(['user']);

      return {
        message: 'Income updated success.',
        data: IncomeResponse(updatedIncome),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async deleteIncome(id: string): Promise<any> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('ID not valid!');
      }

      const income = await this.incomeModel.findOne({ _id: id });
      if (!income) {
        throw new UnprocessableEntityException('Income not found!');
      }

      await this.incomeModel.deleteOne({ _id: id });
      return {
        message: 'Income deleted success.',
        data: {},
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
