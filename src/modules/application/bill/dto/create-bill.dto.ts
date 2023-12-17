import { Exclude } from 'class-transformer'
import { CreateSaleDto } from '../../sale/dto/create-sale.dto'
import { PartialType } from '@nestjs/mapped-types'

export class CreateBillDto extends PartialType(CreateSaleDto) {
  @Exclude()
  readonly paymentMethod: string

  @Exclude()
  readonly times: number

  @Exclude()
  readonly fee: number

  @Exclude()
  readonly discount: number

  constructor(partial: Partial<CreateSaleDto>) {
    super()
    Object.assign(this, partial)
  }
}
