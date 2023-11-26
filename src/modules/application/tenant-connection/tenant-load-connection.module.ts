import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SecretsModule } from '@/modules/infra/secrets/secrets.module';
import { LoadTenantConnectionService } from './load-tenant-connection.service';
import { LoadTenantDataSourceService } from './load-tenant-datasource.service';

@Module({
    imports: [SecretsModule],
    providers: [
        ConfigService,
        LoadTenantDataSourceService,
        LoadTenantConnectionService,
    ],
    exports: [LoadTenantConnectionService],
})
export class LoadTenantConnectionModule {}
