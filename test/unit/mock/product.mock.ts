import { CreateProductDto } from '@/modules/application/product/dto/create-product.dto'
import { Product } from '@infra/db/companies/entities/product/product.entity'
import { faker } from '@faker-js/faker'

export const mockCreateProductDto = ({
  name = null,
  price = null,
  description = null,
  bulkPrice = null,
  quantity = null,
  code = null,
  quantityKg = null,
  quantityKgActual = null,
  thumb = null
} = {}): CreateProductDto => ({
  name: name || faker.string.sample(),
  price: price || faker.number.int(),
  description,
  bulkPrice,
  quantity: quantity || faker.number.int({ max: 10 }),
  quantityKg,
  quantityKgActual,
  code,
  thumb
})

export const mockProductEntity = ({
  description = null,
  bulkPrice = null,
  quantity = 10,
  quantityKg = null,
  quantityKgActual = 0,
  price = null,
  code = null
} = {}): Product => {
  const product: any = {
    id: faker.number.int(),
    name: faker.company.name(),
    price: price || faker.number.int({ max: 1000 }),
    description,
    bulkPrice,
    quantity,
    quantityKg,
    quantityKgActual,
    code,
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    deletedAt: null
  }
  return product as Product
}
