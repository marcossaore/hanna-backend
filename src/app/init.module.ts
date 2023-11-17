import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantModule } from './tenant.module';
import { AppModule } from './app.module';
import configuration from '@/_config/configuration';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        AppModule, // => /api/app/**
        TenantModule // => /api/**
    ]
})
export class InitModule {} 
