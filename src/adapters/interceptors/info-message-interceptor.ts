import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class InfoMessageInterceptor implements NestInterceptor {
    constructor(private readonly infoMessage: string) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next
            .handle()
            .pipe(map((data) => ({ ...data, infoMessage: this.infoMessage })));
    }
}
