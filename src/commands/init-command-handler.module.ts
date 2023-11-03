import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ConfigModule } from '@nestjs/config';
import configuration from '../_config/configuration';
import { TenantCommandModule } from './tenant/tenant-command.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        CommandModule, 
        TenantCommandModule
    ]
})
export class InitCommandHandlerModule {}