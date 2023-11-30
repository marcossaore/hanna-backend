import { NestFactory } from '@nestjs/core'
import { CommandModule, CommandService } from 'nestjs-command'
import { InitCommandHandlerModule } from './commands/init-command-handler.module'

async function bootstrap() {
  const commandApp = await NestFactory.createApplicationContext(
    InitCommandHandlerModule,
    {
      logger: false
    }
  )

  try {
    await commandApp.select(CommandModule).get(CommandService).exec()
    await commandApp.close()
  } catch (error) {
    console.error(error)
    await commandApp.close()
    process.exit(1)
  }
}

bootstrap()
