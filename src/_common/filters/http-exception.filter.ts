import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { DefaultHttpException } from '../errors/default-http-exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as any;

    let error = null;

    if (exception instanceof DefaultHttpException) {
        error = exceptionResponse;
    } else if (Array.isArray(exceptionResponse.message)) {
        let captureErrror = (exceptionResponse as any).message[0];
        try {
            if (typeof captureErrror === 'string' && captureErrror.includes('{') && captureErrror.includes('}')) {
                const parsedMessage = JSON.parse(captureErrror.match(/{(.*?)}/g)[0] || null);
                error = {
                    type: exceptionResponse.error,
                    field: parsedMessage.field,
                    message: parsedMessage.message
                }
            } else {
                error = {
                    captureErrror
                }
            }
        } catch (error) {
            error = {
                captureErrror
            }
        } 
    } else {
        error = {
            type: exceptionResponse.error,
            message: exceptionResponse.message
        }  
    }

    response
      .status(status)
      .json({
        statusCode: status,
        status: false,
        error,
        requestTime: `${Date.now() - request.requestTime}ms`
      });
  }
}