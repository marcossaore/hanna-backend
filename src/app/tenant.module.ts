import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { TenantProvider } from 'src/tenant-connection/tenant-connection.provider';
// import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        {
            module: CustomerModule,
            providers: [
                TenantProvider
            ]
        },
        // {
        //     module: AuthModule,
        //     providers: [
        //         TenantProvider
        //     ]
        // }
    ]
})
export class TenantModule {} 