import { Module, Scope, UnauthorizedException } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { SessionModule } from '@/modules/infra/session/session.module'
import { CustomerModule } from '../customer/customer.module'
import { LoadTenantConnectionModule } from '../tenant-connection/tenant-load-connection.module'
import { LoadTenantConnectionService } from '../tenant-connection/load-tenant-connection.service'
import { Request } from 'express'
import { AuthModule } from '../auth/auth.module'
import { ProductModule } from '../product/product.module'
import { SaleModule } from '../sale/sale.module'

const injectConnectionProvider = () => {
  return {
    provide: 'CONNECTION',
    scope: Scope.REQUEST,
    useFactory: async (
      request: Request,
      loadTenantConnectionService: LoadTenantConnectionService
    ) => {
      const tenantName = request?.session?.auth?.tenant?.identifier
      if (!tenantName) {
        throw new UnauthorizedException()
      }
      try {
        return await loadTenantConnectionService.load(tenantName)
      } catch (error) {
        throw new UnauthorizedException()
      }
    },
    inject: [REQUEST, LoadTenantConnectionService]
  }
}

@Module({
  imports: [
    SessionModule,
    {
      imports: [LoadTenantConnectionModule],
      module: CustomerModule,
      providers: [injectConnectionProvider()],
      exports: ['CONNECTION']
    },
    {
      imports: [LoadTenantConnectionModule],
      module: ProductModule,
      providers: [injectConnectionProvider()],
      exports: ['CONNECTION']
    },
    {
      imports: [LoadTenantConnectionModule],
      module: SaleModule,
      providers: [injectConnectionProvider()],
      exports: ['CONNECTION']
    },
    {
      module: AuthModule,
      imports: [LoadTenantConnectionModule]
    }
  ]
})
export class TenantAppModule {}
