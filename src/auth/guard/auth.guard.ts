import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/utils/enums';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { userResponse } from '../response/user.response';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as Request;
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new ForbiddenException('You do not have access permission!');
    }

    try {
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      if (
        !requiredRoles ||
        !requiredRoles.some((role) => payload.user.role?.includes(role))
      ) {
        throw new ForbiddenException('You do not have access permission!');
      }

      const user = await this.userModel
        .findById(payload.user.id)
        .select(['-password', '-code']);
      if (!user) {
        throw new UnprocessableEntityException('User not valid');
      }
      request['user'] = userResponse(await user);
      request['userRole'] = (await user).role;
      request['isAdmin'] = String((await user).role) === UserRole.Admin;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new NotAcceptableException('Token expired!');
      } else {
        throw new ForbiddenException('You do not have access permission!');
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
