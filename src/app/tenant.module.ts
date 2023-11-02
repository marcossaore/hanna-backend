import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { TenantProvider } from 'src/tenant-connection/tenant-connection.provider';

@Module({
    imports: [
        {
            module: CustomerModule,
            providers: [
                TenantProvider
            ]
        }
    ]
})
export class TenantModule {} 