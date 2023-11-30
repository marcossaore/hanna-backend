import { Module } from '@nestjs/common'
import { UserAppModule } from '../user/user.app.module'

@Module({
  imports: [UserAppModule]
})
export class NoApiModule {}
