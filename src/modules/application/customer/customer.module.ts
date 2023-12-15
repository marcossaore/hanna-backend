import { Module } from '@nestjs/common'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { CustomerService } from './customer.service'
import { CustomerController } from './customer.controller'
import { StorageModule } from '@/modules/infra/storage.module'

@Module({
  imports: [NestjsFormDataModule, StorageModule],
  controllers: [CustomerController],
  providers: [CustomerService]
})
export class CustomerModule {}
