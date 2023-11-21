import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity';
import { Grant } from '@infra/db/companies/entities/module/grant.entity';
import { MailModule } from '@/mail/mail.module';
import { SeedRunnerModule } from '@infra/db/companies/seeds/seed-runner.module';
import { CreateDatabaseModule } from '@/_common/services/Database/create-database.module';
import { SecretsModule } from '@/_common/services/Secret/secrets.module';
import { MigrationsCompanyModule } from '@/_common/services/Database/migrations-company.module';
import { LoadTenantConnectionModule } from '@/tenant-connection/tenant-load-connection.module';
import { ConfigService } from '@nestjs/config';
import { TenantService } from '@/tenant/tenant.service';
import { GenerateDbCredentialsService } from '@/_common/services/Database/generate-db-credentials.service';
import { GenerateUuidService } from '@/_common/services/Uuid/generate-uuid-service';
import { UserServiceLazy } from '@/user/user.service.lazy';
import { AddAdminRoleServiceLazy } from '@/role/add-admin-role.service';
import { MailService } from '@/mail/mail.service';
import { CreateTenantProcessor } from './create-tenant.processor';

@Module({
    imports: [
        TypeOrmModule.forFeature([Tenant, Grant]),
        MailModule,
        SeedRunnerModule,
        CreateDatabaseModule,
        SecretsModule,
        MigrationsCompanyModule,
        LoadTenantConnectionModule
    ],
    providers: [
        ConfigService,
        TenantService,
        GenerateDbCredentialsService,
        GenerateUuidService,
        UserServiceLazy,
        AddAdminRoleServiceLazy,
        MailService,
        CreateTenantProcessor
    ],
    exports: [
        CreateTenantProcessor
    ]
})

export class CreateTenantProcessorModule {}
