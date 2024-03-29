import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity'
import { Grant } from '@infra/db/companies/entities/module/grant.entity'
import { SeedRunnerModule } from '@infra/db/companies/seeds/seed-runner.module'
import { CreateDatabaseModule } from '@infra/plugins/database/create-database.module'
import { MigrationsCompanyModule } from '@infra/plugins/database/migrations-company.module'
import { TokenServiceAdapter } from '@infra/plugins/token/token-service.adapter'
import { MailModule } from '@/modules/infra/mail/mail.module'
import { LoadTenantConnectionModule } from '@/modules/application/tenant-connection/tenant-load-connection.module'
import { TenantService } from '@/modules/application/tenant/tenant.service'
import { UserServiceLazy } from '@/modules/application/user/user.service.lazy'
import { AddAdminRoleServiceLazy } from '@/modules/application/role/add-admin-role.service'
import { CreateTenantProcessor } from './create-tenant.processor'

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, Grant]),
    MailModule,
    SeedRunnerModule,
    CreateDatabaseModule,
    MigrationsCompanyModule,
    LoadTenantConnectionModule
  ],
  providers: [
    ConfigService,
    TenantService,
    UserServiceLazy,
    AddAdminRoleServiceLazy,
    CreateTenantProcessor,
    TokenServiceAdapter
  ],
  exports: [CreateTenantProcessor]
})
export class CreateTenantProcessorModule {}
