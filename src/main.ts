import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SuccessInterceptor } from './utils/interceptor/success.interceptor';

async function bootstrap() {
  const PORT = process.env.PORT || 8080;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new SuccessInterceptor());

  // API Documentation Swagger
  const config = new DocumentBuilder()
    .setTitle('Expense track API')
    .setDescription('Expense track API backend endpoints')
    .setVersion('1.0')
    .addTag('Expense track')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/documentation', app, document);

  await app.listen(PORT);
}
bootstrap();
