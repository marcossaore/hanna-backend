import { HttpException } from "@nestjs/common";
export class UserUnauthorizedException extends HttpException {
    constructor(message: unknown, statusCode: number) {
        super(message, statusCode);
    }
}