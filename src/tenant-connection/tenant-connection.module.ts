import { Module } from '@nestjs/common';
import { TenantProvider } from './tenant-connection.provider';

@Module({
  providers: [TenantProvider],
  exports: ['CONNECTION']
})
export class TenantConnectionModule {}