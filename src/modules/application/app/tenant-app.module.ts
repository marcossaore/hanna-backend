import { Module, Scope, UnauthorizedException } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { CustomerModule } from '../customer/customer.module'
import { LoadTenantConnectionModule } from '../tenant-connection/tenant-load-connection.module'
import { LoadTenantConnectionService } from '../tenant-connection/load-tenant-connection.service'
import { Request } from 'express'
import { AuthModule } from '../auth/auth.module'
import { ProductModule } from '../product/product.module'
import { SaleModule } from '../sale/sale.module'
import { TokenServiceAdapter } from '@infra/plugins/token/token-service.adapter'
import { ConfigService } from '@nestjs/config'
import { UserService } from '../user/user.service'
import { PetModule } from '../pet/pet.module'

const injectConnectionProvider = () => {
  return {
    provide: 'CONNECTION',
    scope: Scope.REQUEST,
    useFactory: async (
      request: Request,
      configService: ConfigService,
      tokenServiceAdapter: TokenServiceAdapter,
      loadTenantConnectionService: LoadTenantConnectionService
    ) => {
      const token = request?.headers['x-token'] as string;

      if (!token) {
        throw new UnauthorizedException(
          'Você não está autenticado para acessar este recurso!'
        )
      }

      let decoded = null;

      try {
        decoded = tokenServiceAdapter.verify(token)
      } catch (error) {
        throw new UnauthorizedException(
          'Você não está autenticado para acessar este recurso!'
        )
      }

      const credentials = configService.get('database');

      request.locals = decoded;

      try {
        return await loadTenantConnectionService.load(
          decoded.companyIdentifier,
          credentials.user,
          credentials.password
        )
      } catch (error) {
        throw new UnauthorizedException(
          'Você não está autenticado para acessar este recurso!'
        )
      }
    },
    inject: [REQUEST, ConfigService, TokenServiceAdapter, LoadTenantConnectionService]
  }
}

@Module({
  imports: [
    {
      imports: [LoadTenantConnectionModule],
      module: CustomerModule,
      providers: [UserService, ConfigService, TokenServiceAdapter, injectConnectionProvider()],
      exports: ['CONNECTION']
    },
    {
      imports: [LoadTenantConnectionModule],
      module: ProductModule,
      providers: [UserService, ConfigService, TokenServiceAdapter, injectConnectionProvider()],
      exports: ['CONNECTION']
    },
    {
      imports: [LoadTenantConnectionModule],
      module: PetModule,
      providers: [UserService, ConfigService, TokenServiceAdapter, injectConnectionProvider()],
      exports: ['CONNECTION']
    },
    {
      imports: [LoadTenantConnectionModule],
      module: SaleModule,
      providers: [UserService, ConfigService, TokenServiceAdapter, injectConnectionProvider()],
      exports: ['CONNECTION']
    },
    {
      module: AuthModule,
      imports: [LoadTenantConnectionModule]
    }
  ]
})
export class TenantAppModule {}
