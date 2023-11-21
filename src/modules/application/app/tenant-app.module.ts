import { Module } from '@nestjs/common';
import { SessionModule } from '@/modules/infra/session/session.module';
// import { CustomerModule } from '@/customer/customer.module';
// import { GetAndLoadTenantConnectionInSessionProvider, LoadTenantConnectionProvider } from '@/tenant-connection/tenant-connection.providers';



@Module({
    imports: [
        SessionModule,
        // {
        //     module: CustomerModule,
        //     providers: [
        //         LoadTenantConnectionProvider,
        //         GetAndLoadTenantConnectionInSessionProvider,
        //     ],
        //     exports: ['CONNECTION']
        // },
        // {
        //     module: AuthModule,
        //     providers: [
        //         LoadTenantConnectionProvider
        //     ]
        // },
    ]
})
export class TenantAppModule {} 