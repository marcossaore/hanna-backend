import { CreateTenantDto } from '@/modules/application/tenant/dto/create-tenant.dto'
import { TenantStatus } from '@/shared/enums/tenant-status.enum'
import { faker } from '@faker-js/faker'
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity'

export const mockCreateCompanyDto = ({
  document = null,
  partnerDocument = null,
  phone = null,
  email = null,
  companyIdentifier = null
} = {}): CreateTenantDto => ({
  name: faker.company.name(),
  document: document || '81102759000187', // valid cnpj
  partnerName: faker.internet.userName(),
  partnerDocument: partnerDocument || '02020957035', // valid cpf
  companyIdentifier:
    companyIdentifier || faker.string.alphanumeric({ length: 10 }),
  phone: phone || faker.string.numeric({ length: 11 }),
  email: email || faker.internet.email()
})

export const mockCompanyEntity = ({
  document = null,
  partnerDocument = null,
  phone = null,
  email = null,
  companyIdentifier = null
} = {}): Tenant => ({
  name: faker.company.name(),
  document: document || faker.string.numeric({ length: 14 }),
  partnerName: faker.internet.userName(),
  partnerDocument: partnerDocument || faker.string.numeric({ length: 11 }),
  companyIdentifier: companyIdentifier || faker.company.buzzNoun(),
  phone: phone || faker.phone.number(),
  email: email || faker.internet.email(),
  id: faker.string.uuid(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
  status: TenantStatus.PENDING
})
