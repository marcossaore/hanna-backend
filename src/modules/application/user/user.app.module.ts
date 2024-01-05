import { Module } from '@nestjs/common'
import { UserAppController } from './user.app.controller'
import { TokenServiceAdapter } from '@infra/plugins/token/token-service.adapter'
import { ConfigService } from '@nestjs/config'
import { TenantService } from '../tenant/tenant.service'
import { UserServiceLazy } from './user.service.lazy'
import { LoadTenantConnectionModule } from '../tenant-connection/tenant-load-connection.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity'
import { Grant } from '@infra/db/companies/entities/module/grant.entity'
import { MailModule } from '@/modules/infra/mail/mail.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, Grant]),
    MailModule,
    LoadTenantConnectionModule
  ],
  controllers: [UserAppController],
  providers: [
    ConfigService,
    TenantService,
    UserServiceLazy,
    TokenServiceAdapter, 
    UserServiceLazy
  ]
})
export class UserAppModule {}