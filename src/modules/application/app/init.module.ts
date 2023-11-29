import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantAppModule } from './tenant-app.module';
import { AppModule } from './app.module';
import configuration from '@/shared/config/configuration';
import { NoApiModule } from './no-api.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        NoApiModule, // => /app
        AppModule, // => /api/app/**
        TenantAppModule, // => /api/**
    ],
})
export class InitModule {}
