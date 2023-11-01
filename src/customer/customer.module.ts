import { Module } from '@nestjs/common';
import { GenerateUuidService } from '../_common/services/Uuid/generate-uuid-service';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';

@Module({
  controllers: [CustomerController],
  providers: [GenerateUuidService, CustomerService],
})
export class CustomerModule {}
