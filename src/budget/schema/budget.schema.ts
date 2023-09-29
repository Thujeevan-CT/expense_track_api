import mongoose from 'mongoose';
import * as moment from 'moment';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { ExpenseCategory } from 'src/expense-category/schema/expense-category.schema';
import { BudgetType, Status } from 'src/utils/enums';

@Schema({ timestamps: false, versionKey: false })
export class Budget {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ExpenseCategory' })
  category: ExpenseCategory;

  @Prop({ type: mongoose.Schema.Types.Number })
  amount: number;

  @Prop({ required: false, enum: BudgetType, default: BudgetType.Weekly })
  budget_type: string;

  @Prop({ type: mongoose.Schema.Types.Number })
  start_date: number;

  @Prop({ type: mongoose.Schema.Types.Number })
  end_date: number;

  @Prop({ required: true, enum: Status, default: Status.Active })
  status: Status;

  @Prop({ required: false, default: () => moment.utc().format() })
  created_at: string;

  @Prop({ required: false, default: () => moment.utc().format() })
  updated_at: string;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
