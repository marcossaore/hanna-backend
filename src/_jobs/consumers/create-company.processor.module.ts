import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Company } from '@db/app/entities/company/company.entity';
import { Grant } from '@db/companies/entities/module/grant.entity';
import { MailModule } from '@/mail/mail.module';
import { CompanyService } from '@/company/company.service';
import { GenerateDbCredentialsService } from '@/_common/services/Database/generate-db-credentials.service';
import { GenerateUuidService } from '@/_common/services/Uuid/generate-uuid-service';
import { MailService } from '@/mail/mail.service';
import { CreateCompanyProcessor } from './create-company.processor';
import { SeedRunnerModule } from '@db/companies/seeds/seed-runner.module';
import { SecretsModule } from '@/_common/services/Secret/secrets.module';
import { CreateDatabaseModule } from '@/_common/services/Database/create-database.module';
import { MigrationsCompanyModule } from '@/_common/services/Database/migrations-company.module';
import { UserServiceLazy } from '@/user/user.service.lazy';
import { LoadTenantConnectionModule } from '@/tenant-connection/tenant-load-connection.module';
import { AddAdminRoleServiceLazy } from '@/role/add-admin-role.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Company, Grant]),
        MailModule,
        SeedRunnerModule,
        CreateDatabaseModule,
        SecretsModule,
        MigrationsCompanyModule,
        LoadTenantConnectionModule
    ],
    providers: [
        ConfigService,
        CompanyService,
        GenerateDbCredentialsService,
        GenerateUuidService,
        UserServiceLazy,
        AddAdminRoleServiceLazy,
        MailService,
        CreateCompanyProcessor
    ],
    exports: [
        CreateCompanyProcessor
    ]
})

export class CreateCompanyProcessorModule {}
