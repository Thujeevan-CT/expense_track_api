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
import { Budget, BudgetSchema } from 'src/budget/schema/budget.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Expense.name, schema: ExpenseSchema },
      { name: User.name, schema: UserSchema },
      { name: ExpenseCategory.name, schema: ExpenseCategorySchema },
      { name: Income.name, schema: IncomeSchema },
      { name: Budget.name, schema: BudgetSchema },
    ]),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
