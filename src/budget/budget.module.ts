import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Budget, BudgetSchema } from './schema/budget.schema';
import {
  ExpenseCategory,
  ExpenseCategorySchema,
} from 'src/expense-category/schema/expense-category.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Budget.name, schema: BudgetSchema },
      { name: ExpenseCategory.name, schema: ExpenseCategorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
