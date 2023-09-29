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
import { BudgetService } from './budget.service';
import { AddBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
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
import { Request } from 'express';
import { UserRole } from 'src/utils/enums';

@ApiTags('Budget')
@Controller('budget')
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiForbiddenResponse({ description: 'Access denied.' })
@ApiNotFoundResponse({ description: 'Not found.' })
@ApiUnprocessableEntityResponse({ description: 'Bad Request.' })
@ApiInternalServerErrorResponse({ description: 'Internal server error.' })
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  @Roles(UserRole.User)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new budget' })
  @ApiOkResponse({ description: 'Budget added.' })
  async addBudget(@Query() data: AddBudgetDto, @Req() req: Request) {
    return this.budgetService.addNewBudget(data, req);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.User)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all budgets' })
  @ApiOkResponse({ description: 'Budgets retrieved.' })
  async getBudgets(@Req() req: Request) {
    return this.budgetService.getBudgets(req);
  }

  @Get(':id')
  @Roles(UserRole.Admin, UserRole.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a budget' })
  @ApiOkResponse({ description: 'Budget retrieved.' })
  async getSingleBudget(@Param('id') id: string, @Req() req: Request) {
    return this.budgetService.getSingleBudget(id, req);
  }

  @Put(':id')
  @Roles(UserRole.Admin, UserRole.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a expense' })
  @ApiOkResponse({ description: 'Expense updated.' })
  async update(@Param('id') id: string, @Query() data: UpdateBudgetDto) {
    return this.budgetService.updateBudget(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.Admin, UserRole.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a expense' })
  @ApiOkResponse({ description: 'Expense deleted.' })
  async remove(@Param('id') id: string) {
    return this.budgetService.deleteBudget(id);
  }
}
