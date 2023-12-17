import { Inject, Injectable } from '@nestjs/common'
import { Connection, Repository } from 'typeorm'
import { CreateBillDto } from './dto/create-bill.dto'
import { Bill } from '@infra/db/companies/entities/sale/bill.entity'

@Injectable()
export class BillService {
  private readonly billRepository: Repository<Bill>

  constructor(@Inject('CONNECTION') private readonly connection: Connection) {
    this.billRepository = this.connection.getRepository(Bill)
  }

  create(createBillDto: CreateBillDto & { amount: number }) {
    return this.billRepository.save(createBillDto)
  }
}
