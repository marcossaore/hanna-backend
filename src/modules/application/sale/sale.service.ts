import { Connection, Repository } from 'typeorm'
import { Inject, Injectable } from '@nestjs/common'
import { Sale } from '@infra/db/companies/entities/sale/sale.entity'
import { CreateSaleDto } from './dto/create-sale.dto'

@Injectable()
export class SaleService {
  private readonly saleRepository: Repository<Sale>

  constructor(@Inject('CONNECTION') private readonly connection: Connection) {
    this.saleRepository = this.connection.getRepository(Sale)
  }

  create(
    createSaleDto: CreateSaleDto & { amount: number; originalAmount: number }
  ) {
    return this.saleRepository.save(createSaleDto)
  }
}
