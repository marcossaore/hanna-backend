import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CalculateRequestTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    return next.handle().pipe(map(data => { 
        if (data instanceof(Array)) {
            data = [
                ...data
            ]
        }else {
            data = {
                ...data
            }
        }
        const result = {
            requestTime: `${Date.now() - request.requestTime}ms`,
            message: undefined,
            status: true,
            statusCode: response.statusCode,
            data
        };

        if (result?.data?.infoMessage) {
            result.message = result.data.infoMessage;
            result.data.infoMessage = undefined;
        }
        return result;
    }));
  }
}