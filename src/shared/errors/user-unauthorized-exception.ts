import { DefaultHttpException } from './default-http-exception';
export class UserUnauthorizedException extends DefaultHttpException {
    constructor(message: unknown, statusCode: number) {
        super(message, statusCode);
    }
}
