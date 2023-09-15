import * as moment from 'moment';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Status } from 'src/utils/enums';

@Schema({ timestamps: false, versionKey: false })
export class ExpenseCategory {
  @Prop({ required: true, type: String, unique: true })
  name: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, enum: Status, default: Status.Active })
  status: Status;

  @Prop({ required: false, default: () => moment.utc().format() })
  created_at: string;

  @Prop({ required: false, default: () => moment.utc().format() })
  updated_at: string;
}

export const ExpenseCategorySchema =
  SchemaFactory.createForClass(ExpenseCategory);
