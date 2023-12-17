import { Module } from '@nestjs/common'
import { SaleService } from './sale.service'
import { SaleController } from './sale.controller'
import { ProductService } from '../product/product.service'
import { CustomerService } from '../customer/customer.service'
import { BillService } from '../bill/bill.service'

@Module({
  controllers: [SaleController],
  providers: [SaleService, ProductService, CustomerService, BillService]
})
export class SaleModule {}
