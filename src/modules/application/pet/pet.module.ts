import { Module } from '@nestjs/common'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { StorageModule } from '@/modules/infra/storage.module'
import { PetService } from './pet.service'
import { PetController } from './pet.controller'
import { CustomerService } from '../customer/customer.service'

@Module({
  imports: [NestjsFormDataModule, StorageModule],
  controllers: [PetController],
  providers: [PetService, CustomerService]
})
export class PetModule {}
