import {
  Controller,
  Param,
  Req,
  Query,
  Get,
  Put,
  Post,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { AddExpenseDto } from './dto/addExpense.dto';
import { Request } from 'express';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/utils/enums';
import { UpdateExpenseDto } from './dto/updateExpense.dto';
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

@ApiTags('Expenses')
@Controller('expense')
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiForbiddenResponse({ description: 'Access denied.' })
@ApiNotFoundResponse({ description: 'Not found.' })
@ApiUnprocessableEntityResponse({ description: 'Bad Request.' })
@ApiInternalServerErrorResponse({ description: 'Internal server error.' })
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Post()
  @Roles(UserRole.User)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new expense' })
  @ApiOkResponse({ description: 'Expense added.' })
  async addNewExpense(
    @Query() data: AddExpenseDto,
    @Req() req: Request,
  ): Promise<any> {
    return this.expenseService.addNewExpense(data, req);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.User)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiOkResponse({ description: 'Expenses retrieved.' })
  async getExpenses(@Req() req: Request): Promise<any> {
    return this.expenseService.getExpenses(req);
  }

  @Get(':id')
  @Roles(UserRole.Admin, UserRole.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a expense' })
  @ApiOkResponse({ description: 'Expense retrieved.' })
  async getSingleExpense(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<any> {
    return this.expenseService.getSingleExpense(id, req);
  }

  @Put(':id')
  @Roles(UserRole.Admin, UserRole.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a expense' })
  @ApiOkResponse({ description: 'Expense updated.' })
  async updateExpense(
    @Param('id') id: string,
    @Query() data: UpdateExpenseDto,
  ): Promise<any> {
    return this.expenseService.updateExpense(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.Admin, UserRole.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a expense' })
  @ApiOkResponse({ description: 'Expense deleted.' })
  async deleteExpense(@Param('id') id: string): Promise<any> {
    return this.expenseService.deleteExpense(id);
  }
}
