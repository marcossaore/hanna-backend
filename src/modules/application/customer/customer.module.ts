import { Module } from '@nestjs/common'
import { GenerateUuidService } from '@infra/plugins/uuid/generate-uuid-service'
import { CustomerService } from './customer.service'
import { CustomerController } from './customer.controller'
import { StorageModule } from '@/modules/infra/storage.module'
import { NestjsFormDataModule } from 'nestjs-form-data'

@Module({
  imports: [NestjsFormDataModule, StorageModule],
  controllers: [CustomerController],
  providers: [GenerateUuidService, CustomerService]
})
export class CustomerModule {}
