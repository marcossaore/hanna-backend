import { Connection } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { UserService } from './user.service'
import { Lazy } from '@/shared/protocols/lazy'

@Injectable()
export class UserServiceLazy implements Lazy<Connection, UserService> {
  load(connection: Connection): UserService {
    return new UserService(connection)
  }
}
