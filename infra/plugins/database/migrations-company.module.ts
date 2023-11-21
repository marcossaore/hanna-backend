import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MigrationsCompanyService } from './migrations-company.service';

@Module({
    providers: [
        ConfigService,
        MigrationsCompanyService
    ],
    exports: [
        MigrationsCompanyService
    ]
})

export class MigrationsCompanyModule {}
