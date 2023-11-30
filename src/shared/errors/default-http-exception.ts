import { HttpException } from '@nestjs/common'

export class DefaultHttpException extends HttpException {
  constructor(message: unknown, statusCode: number) {
    super(message, statusCode)
  }
}
