import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { InitModule } from './app/init.module';

import { CalculateRequestTimeInterceptor } from './_common/interceptors/calculate-request-time-interceptor';
import { HttpExceptionFilter } from './_common/filters/http-exception.filter';
import { AddRequestTimeMiddleware } from './_common/middlewares/add-request-time-middleware';

async function bootstrap() {
    const app = await NestFactory.create(InitModule);
    app.useGlobalPipes(new ValidationPipe());
    app.use((new AddRequestTimeMiddleware()).use);
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new CalculateRequestTimeInterceptor());
    await app.listen(3000);
}

bootstrap();
