import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Query,
  HttpCode,
  Req,
  Put,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
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
import { Request } from 'express';

@ApiTags('Income')
@Controller('income')
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiForbiddenResponse({ description: 'Access denied.' })
@ApiNotFoundResponse({ description: 'Not found.' })
@ApiUnprocessableEntityResponse({ description: 'Bad Request.' })
@ApiInternalServerErrorResponse({ description: 'Internal server error.' })
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  @Roles(UserRole.User)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new income' })
  @ApiOkResponse({ description: 'Income added.' })
  async addNewIncome(@Query() data: CreateIncomeDto, @Req() req: Request) {
    return this.incomeService.addNewIncome(data, req);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.User)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all incomes' })
  @ApiOkResponse({ description: 'Incomes retrieved.' })
  async findAllIncomes(@Req() req: Request) {
    return this.incomeService.findAllIncomes(req);
  }

  @Get(':id')
  @Roles(UserRole.Admin, UserRole.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a income' })
  @ApiOkResponse({ description: 'Income retrieved.' })
  async findSingleIncome(@Param('id') id: string, @Req() req: Request) {
    return this.incomeService.getSingleIncome(id, req);
  }

  @Put(':id')
  @Roles(UserRole.Admin, UserRole.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a income' })
  @ApiOkResponse({ description: 'Income updated.' })
  async updateIncome(@Param('id') id: string, @Query() data: UpdateIncomeDto) {
    return this.incomeService.updateIncome(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.Admin, UserRole.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a expense' })
  @ApiOkResponse({ description: 'Expense deleted.' })
  async deleteIncome(@Param('id') id: string) {
    return this.incomeService.deleteIncome(id);
  }
}
