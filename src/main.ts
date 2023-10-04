import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';

import { AddRequestTimeMiddleware } from './middlewares/add-request-time-middleware';
import { CalculateRequestTimeInterceptor } from './interceptors/calculate-request-time-interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use((new AddRequestTimeMiddleware()).use);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new CalculateRequestTimeInterceptor());
  await app.listen(3000);
}

bootstrap();
