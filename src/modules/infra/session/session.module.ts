import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SessionManager } from './session.manager'

@Module({
  providers: [
    {
      provide: 'SESSION_OPTIONS',
      useFactory: (configService: ConfigService) => {
        const session = configService.get('session')
        return {
          ...session
        }
      },
      inject: [ConfigService]
    },
    SessionManager
  ]
})
export class SessionModule implements NestModule {
  constructor(private readonly sessionManager: SessionManager) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(this.sessionManager.getSession()).forRoutes('*')
  }
}
