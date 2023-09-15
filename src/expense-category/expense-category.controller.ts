import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ExpenseCategoryService } from './expense-category.service';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
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

@ApiTags('Expense category')
@Controller('expense-category')
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiForbiddenResponse({ description: 'Access denied.' })
@ApiNotFoundResponse({ description: 'Not found.' })
@ApiUnprocessableEntityResponse({ description: 'Bad Request.' })
@ApiInternalServerErrorResponse({ description: 'Internal server error.' })
export class ExpenseCategoryController {
  constructor(
    private readonly expenseCategoryService: ExpenseCategoryService,
  ) {}

  @Post()
  @Roles(UserRole.Admin)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new expense category' })
  @ApiOkResponse({ description: 'Expense category created.' })
  async create(@Query() createExpenseCategoryDto: CreateExpenseCategoryDto) {
    return this.expenseCategoryService.create(createExpenseCategoryDto);
  }

  @Get()
  @Roles(UserRole.User, UserRole.Admin)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all expense category' })
  @ApiOkResponse({ description: 'Expense categories retrieved.' })
  async findAll(@Req() req: Request) {
    return this.expenseCategoryService.findAll(req);
  }

  @Get(':id')
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a expense category' })
  @ApiOkResponse({ description: 'Expense category retrieved.' })
  async findOne(@Param('id') id: string) {
    return this.expenseCategoryService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a expense category' })
  @ApiOkResponse({ description: 'Expense category updated.' })
  async update(
    @Param('id') id: string,
    @Query() data: UpdateExpenseCategoryDto,
  ) {
    return this.expenseCategoryService.update(id, data);
  }
}
