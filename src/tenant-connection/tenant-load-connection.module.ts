import { Module } from '@nestjs/common';
import { SecretsModule } from '@/_common/services/Secret/secrets.module';
import { ConfigService } from '@nestjs/config';
import { LoadTenantDataSourceService } from './load-tenant-datasource.service';
import { LoadTenantConnectionService } from './load-tenant-connection.service';

@Module({
    imports: [SecretsModule],
    providers: [
        ConfigService,
        LoadTenantDataSourceService,
        LoadTenantConnectionService
    ],
    exports: [
        LoadTenantConnectionService
    ]
})

export class LoadTenantConnectionModule {}


// export const GetAndLoadTenantConnectionInSessionProvider = {
//     provide: 'CONNECTION',
//     scope: Scope.REQUEST,
//     useFactory: async (request: Request, loadTenantConnectionService: LoadTenantConnectionService) => {
//         const tenantName =  request?.session?.auth?.tenant?.identifier;
//         if (!tenantName) {
//             throw new UnauthorizedException()
//         }
//         try {
//             return await loadTenantConnectionService.load(tenantName)
//         } catch (error) {
//             throw new UnauthorizedException()
//         }
//     },
//     inject: [REQUEST, LoadTenantConnectionService]
// }