import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { AuthModule } from '../auth/auth.module';
import { GetAndLoadTenantConnectionInSessionProvider, LoadTenantConnectionProvider } from 'src/tenant-connection/tenant-connection.providers';
import { SessionModule } from '../session/session.module';
import { SessionSerializer } from '../auth/session.serializer';

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
    ],
    providers: [
        SessionSerializer
    ]
})
export class TenantModule {} 