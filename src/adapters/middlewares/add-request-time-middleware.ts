import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction } from 'express'

@Injectable()
export class AddRequestTimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    ;(req as any).requestTime = Date.now()
    next()
  }
}
