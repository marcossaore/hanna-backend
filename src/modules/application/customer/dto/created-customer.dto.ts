import { Customer } from '@infra/db/companies/entities/customer/customer.entity'
import { PartialType } from '@nestjs/mapped-types'
import { Exclude, Expose } from 'class-transformer'

export class CreatedCustomerDto extends PartialType(Customer) {
  @Exclude()
  id: number

  @Expose()
  thumb: string

  constructor(partial: Partial<Customer & { thumb?: string }>) {
    super()
    Object.assign(this, partial)
  }
}
