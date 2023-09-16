import { Module } from '@nestjs/common';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './schema/expense.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import {
  ExpenseCategory,
  ExpenseCategorySchema,
} from 'src/expense-category/schema/expense-category.schema';
import { Income, IncomeSchema } from 'src/income/schema/income.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Expense.name, schema: ExpenseSchema },
      { name: User.name, schema: UserSchema },
      { name: ExpenseCategory.name, schema: ExpenseCategorySchema },
      { name: Income.name, schema: IncomeSchema },
    ]),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
