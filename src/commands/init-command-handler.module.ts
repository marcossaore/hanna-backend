import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/shared/config/configuration';
import { ExampleCommandModule } from './example/example-command.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        CommandModule, 
        ExampleCommandModule
    ]
})
export class InitCommandHandlerModule {}