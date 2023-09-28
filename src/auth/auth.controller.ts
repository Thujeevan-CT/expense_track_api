import {
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from 'src/auth/dto/register.dto';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { loginDto } from './dto/login.dto';
import { forgotPasswordDto } from './dto/forgotPassword.dto';
import { resetPasswordDto } from './dto/resetPassword.dto';
import { Public } from './decorator/public.decorator';
import { Roles } from './decorator/roles.decorator';
import { UserRole } from 'src/utils/enums';
import { Request as Req } from 'express';

@ApiTags('Auth')
@Controller('auth')
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiForbiddenResponse({ description: 'Access denied.' })
@ApiNotFoundResponse({ description: 'Not found.' })
@ApiUnprocessableEntityResponse({ description: 'Bad Request.' })
@ApiInternalServerErrorResponse({ description: 'Internal server error.' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(200)
  @Public()
  @ApiOperation({ summary: 'register user' })
  @ApiOkResponse({ description: 'User registered Successfully.' })
  async register(@Query() data: registerDto): Promise<any> {
    return this.authService.registerUser(data);
  }

  @Post('/login')
  @HttpCode(200)
  @Public()
  @ApiOperation({ summary: 'login user' })
  @ApiOkResponse({ description: 'User logged in Successfully.' })
  async login(@Query() data: loginDto): Promise<any> {
    return this.authService.login(data);
  }

  @Post('/forgot-password')
  @HttpCode(200)
  @Public()
  @ApiOperation({ summary: 'user forgot password' })
  @ApiOkResponse({ description: 'Reset password link sent in email of user.' })
  async forgotPassword(@Query() data: forgotPasswordDto): Promise<any> {
    return this.authService.forgotPassword(data);
  }

  @Post('/password-reset')
  @HttpCode(200)
  @Public()
  @ApiOperation({ summary: 'user forgot password' })
  @ApiOkResponse({ description: 'Reset password link sent in email of user.' })
  async resetPassword(@Query() data: resetPasswordDto): Promise<any> {
    return this.authService.resetPassword(data);
  }

  @Get('/refresh-token')
  @HttpCode(200)
  @Public()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'refresh token' })
  @ApiOkResponse({ description: 'Generated refresh token.' })
  async refreshToken(@Request() req: Req): Promise<any> {
    return this.authService.refreshToken(req);
  }
}
