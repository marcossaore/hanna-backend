import { Expose } from 'class-transformer'
import { PartialType } from '@nestjs/mapped-types'
import { Product } from '@infra/db/companies/entities/product/product.entity'

export class ProductDto extends PartialType(Product) {
  @Expose()
  thumb: string

  constructor(partial: Partial<Product & { thumb?: string }>) {
    super()
    Object.assign(this, partial)
  }
}
