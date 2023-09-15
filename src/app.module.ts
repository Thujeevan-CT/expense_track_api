import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import ConnectDatabase from './utils/database';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JWTConnect } from './utils/jwt';
import { ExpenseModule } from './expense/expense.module';
import { ExpenseCategoryModule } from './expense-category/expense-category.module';
import { User, UserSchema } from './user/schema/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync(ConnectDatabase),
    EventEmitterModule.forRoot(),
    JwtModule.registerAsync(JWTConnect),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    UserModule,
    ExpenseModule,
    ExpenseCategoryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Authorization
    },
  ],
})
export class AppModule {}
