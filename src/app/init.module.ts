import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../_config/configuration';
import { AppModule } from './app.module';
import { TenantModule } from './tenant.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        AppModule,
        TenantModule
    ]
})
export class InitModule {} 
