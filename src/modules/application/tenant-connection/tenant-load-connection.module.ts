import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LoadTenantConnectionService } from './load-tenant-connection.service'
import { LoadTenantDataSourceService } from './load-tenant-datasource.service'

@Module({
  providers: [
    ConfigService,
    LoadTenantDataSourceService,
    LoadTenantConnectionService
  ],
  exports: [LoadTenantConnectionService]
})
export class LoadTenantConnectionModule {}
