import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { registerDto } from 'src/auth/dto/register.dto';
import { User } from 'src/user/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/utils/mail/mail.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmailActions } from 'src/utils/enums';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/login.dto';
import { forgotPasswordDto } from './dto/forgotPassword.dto';
import { userResponse } from './response/user.response';
import { resetPasswordDto } from './dto/resetPassword.dto';
import { generateDigitCode } from 'src/utils/helpers';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private mailService: MailService,
    private eventEmitter: EventEmitter2,
    private jwtService: JwtService,
  ) {}

  async registerUser({
    first_name,
    last_name,
    email,
    password,
  }: registerDto): Promise<any> {
    try {
      const isEmailUnique = await this.userModel.findOne({ email: email });
      if (isEmailUnique) {
        throw new UnprocessableEntityException('Email already exist!');
      }

      const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.BCRYPT_SALT),
      );

      const userData = this.userModel.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
      });

      return {
        status: true,
        message: 'Account registered success.',
        user: userResponse(await userData),
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async login(data: loginDto): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email: data.email });
      if (!user) {
        throw new NotFoundException('Email or password incorrect!');
      }

      const isMatchAccount = await bcrypt.compare(data.password, user.password);
      if (!isMatchAccount) {
        throw new NotFoundException('Email or password incorrect!');
      }

      const accessToken = this.jwtService.sign(
        { user: userResponse(await user) },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      );
      return {
        message: 'User logged in success.',
        data: {
          token: accessToken,
          user: userResponse(await user),
        },
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async refreshToken(req: any): Promise<any> {
    try {
      const token =
        req.headers['authorization'] &&
        req.headers['authorization'].split(' ')[1];

      const expiredPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
        ignoreExpiration: true,
      });

      const accessToken = this.jwtService.sign(
        { user: expiredPayload.user },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      );

      return {
        message: 'Refresh token generated successfully',
        data: { token: accessToken },
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async forgotPassword(data: forgotPasswordDto): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email: data.email });
      if (!user) {
        throw new NotFoundException('Email is not valid!');
      }

      const digitCode = generateDigitCode();
      (await user).code = digitCode;
      await (await user).save();

      this.eventEmitter.emit(EmailActions.FORGOT_PASSWORD_EMAIL, {
        name: `${(await user).first_name} ${(await user).last_name}`,
        email: (await user).email,
        code: digitCode,
      });

      return {
        message: 'Reset password link sent you email.',
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async resetPassword(data: resetPasswordDto): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email: data.email });
      if (!user) throw new NotFoundException('User not valid!');
      if (Number((await user).code) === 0)
        throw new UnprocessableEntityException('Code expired!');

      const isMatchDigitCode = Number((await user).code) === Number(data.code);
      if (!isMatchDigitCode) {
        throw new UnprocessableEntityException('Code invalid!');
      }

      const hashedPassword = await bcrypt.hash(
        data.password,
        Number(process.env.BCRYPT_SALT),
      );

      (await user).password = hashedPassword;
      (await user).code = 0;
      await user.save();

      return {
        message: 'Password reset success.',
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
