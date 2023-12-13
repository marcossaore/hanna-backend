import { Module } from '@nestjs/common'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { StorageModule } from '@/modules/infra/storage.module'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'

@Module({
  imports: [NestjsFormDataModule, StorageModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
