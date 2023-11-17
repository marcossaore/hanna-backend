import { Module } from '@nestjs/common';
import { SessionModule } from '@/session/session.module';
import { CustomerModule } from '@/customer/customer.module';
import { GetAndLoadTenantConnectionInSessionProvider, LoadTenantConnectionProvider } from '@/tenant-connection/tenant-connection.providers';
import { AuthModule } from '@/auth/auth.module';


@Module({
    imports: [
        SessionModule,
        {
            module: CustomerModule,
            providers: [
                LoadTenantConnectionProvider,
                GetAndLoadTenantConnectionInSessionProvider,
            ],
            exports: ['CONNECTION']
        },
        {
            module: AuthModule,
            providers: [
                LoadTenantConnectionProvider
            ]
        },
    ]
})
export class TenantModule {} 