import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException
} from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse() as any

    let error = null

    if (exception instanceof HttpException) {
      error = {
        type: exceptionResponse.error,
        message: exceptionResponse.message
      }
    } else if (Array.isArray(exceptionResponse.message)) {
      const captureError = (exceptionResponse as any).message[0]
      try {
        if (
          typeof captureError === 'string' &&
          captureError.includes('{') &&
          captureError.includes('}')
        ) {
          const parsedMessage = JSON.parse(
            captureError.match(/{(.*?)}/g)[0] || null
          )
          error = {
            type: exceptionResponse.error,
            field: parsedMessage.field,
            message: parsedMessage.message
          }

          if (parsedMessage.fieldAccepts) {
            error['fieldAccepts'] = parsedMessage.fieldAccepts;
          }

        } else {
          error = {
            captureError
          }
        }
      } catch (error) {
        error = {
          captureError
        }
      }
    } else {
      error = {
        type: exceptionResponse.error,
        message: exceptionResponse.message
      }
    }

    response.status(status).json({
      statusCode: status,
      status: false,
      error,
      requestTime: `${Date.now() - request.requestTime}ms`
    })
  }
}
