import * as moment from 'moment';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Status, UserRole } from 'src/utils/enums';

@Schema({ timestamps: false, versionKey: false })
export class User {
  @Prop({ required: true, type: String })
  first_name: string;

  @Prop({ required: true, type: String })
  last_name: string;

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.User })
  role: Status;

  @Prop({ required: true, enum: Status, default: Status.Active })
  status: Status;

  @Prop({ required: false, type: String, default: 0 })
  code: number;

  @Prop({ required: false, default: () => moment.utc().format() })
  createdAt: string;

  @Prop({ required: false, default: () => moment.utc().format() })
  updatedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
