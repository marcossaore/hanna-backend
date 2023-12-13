import { CreateProductDto } from '@/modules/application/product/dto/create-product.dto'
import { Product } from '@infra/db/companies/entities/product/product.entity'
import { faker } from '@faker-js/faker'

export const mockCreateProductDto = ({
  name = null,
  price = null,
  description = null,
  bulkPrice = null,
  code = null
} = {}): CreateProductDto => ({
  name: name || faker.string.sample(),
  price: price || faker.number.int(),
  description,
  bulkPrice,
  code
})

export const mockProductEntity = ({
  description = null,
  bulkPrice = null,
  code = null
} = {}): Product => {
  const product: Product = {
    id: faker.number.int(),
    name: faker.company.name(),
    price: faker.number.int(),
    description,
    bulkPrice,
    code,
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    deletedAt: null
  }
  return product
}
