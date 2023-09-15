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

type userUpdateType = {
  first_name: string;
  last_name: string;
  password?: number;
  updated_at: string;
};
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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

      if (new_password === current_password)
        throw new UnprocessableEntityException('Passwords are same!');

      let hashedPassword = 0;
      if (new_password && current_password) {
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
}
