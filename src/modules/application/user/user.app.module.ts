import { Module } from '@nestjs/common'
import { UserAppController } from './user.app.controller'
import { TokenServiceAdapter } from '@infra/plugins/token/token-service.adapter'
import { ConfigService } from '@nestjs/config'

@Module({
  controllers: [UserAppController],
  providers: [ConfigService, TokenServiceAdapter]
})
export class UserAppModule {}
