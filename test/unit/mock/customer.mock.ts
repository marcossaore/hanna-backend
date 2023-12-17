import { faker } from '@faker-js/faker'
import { CreateCustomerDto } from '@/modules/application/customer/dto/create-customer.dto'
import { Customer } from '@infra/db/companies/entities/customer/customer.entity'

export const mockCreateCustomerWithAddressDto = ({
  complement = null,
  email = null,
  thumb = null
} = {}): CreateCustomerDto => ({
  name: faker.company.name(),
  email: email || faker.internet.email(),
  phone: faker.string.numeric({ length: 11 }),
  thumb,
  address: {
    street: faker.location.streetAddress(),
    neighborhood: faker.location.secondaryAddress(),
    number: faker.string.numeric(),
    city: faker.location.city(),
    country: faker.location.state(),
    state: faker.location.country(),
    complement
  }
})

export const mockCustomerEntity = ({
  email = null,
  complement = null
} = {}): Customer => {
  const customer: any = {
    id: faker.string.uuid(),
    name: faker.company.name(),
    phone: faker.phone.number(),
    street: faker.location.streetAddress(),
    neighborhood: faker.location.secondaryAddress(),
    number: faker.string.numeric(),
    city: faker.location.city(),
    country: faker.location.state(),
    state: faker.location.country(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    deletedAt: null
  }

  if (email) {
    customer.email = email
  }

  if (complement) {
    customer.complement = complement
  }

  return customer as Customer
}
