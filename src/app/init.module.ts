import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantAppModule } from './tenant-app.module';
import { AppModule } from './app.module';
import configuration from '@/_config/configuration';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        AppModule, // => /api/app/**
        TenantAppModule // => /api/**
    ]
})
export class InitModule {} 
