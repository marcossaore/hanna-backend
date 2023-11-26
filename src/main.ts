import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { InitModule } from './modules/application/app/init.module';
import { AddRequestTimeMiddleware } from './adapters/middlewares/add-request-time-middleware';
import { HttpExceptionFilter } from './adapters/filters/http-exception.filter';
import { CalculateRequestTimeInterceptor } from './adapters/interceptors/calculate-request-time-interceptor';

async function bootstrap() {
    const app = await NestFactory.create(InitModule);
    app.useGlobalPipes(new ValidationPipe());
    app.use(new AddRequestTimeMiddleware().use);
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new CalculateRequestTimeInterceptor());
    await app.listen(3000);
}

bootstrap();
