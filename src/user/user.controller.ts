import {
  Controller,
  Param,
  Put,
  Query,
  HttpCode,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { userUpdateDto } from './dto/userUpdate.dto';
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
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/utils/enums';
import { Request as Req } from 'express';

@ApiTags('User')
@Controller('user')
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiForbiddenResponse({ description: 'Access denied.' })
@ApiNotFoundResponse({ description: 'Not found.' })
@ApiUnprocessableEntityResponse({ description: 'Bad Request.' })
@ApiInternalServerErrorResponse({ description: 'Internal server error.' })
export class UserController {
  constructor(private userService: UserService) {}

  @Put('/update/:id')
  @Roles(UserRole.User)
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ description: 'User updated Successfully.' })
  @ApiBearerAuth()
  async userUpdate(
    @Request() req: Req,
    @Param('id') id: string,
    @Query() data: userUpdateDto,
  ): Promise<any> {
    return this.userService.userUpdate(req, id, data);
  }
}
