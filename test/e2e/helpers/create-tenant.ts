import { INestApplication } from '@nestjs/common'
import { HashService } from '@infra/plugins/hash/hash.service'
import { getAllDatabases } from './connections'
import * as request from 'supertest'
import { faker } from '@faker-js/faker'

export const createTenant = async (app: INestApplication) => {
  const email = faker.internet.email()
  const companyIdentifier = faker.string.alphanumeric({ length: 10 })
  const companyDocument = '78457770000155'
  const partnerDocument = '43905610060'
  const partnerName = faker.person.fullName()
  const password: string = 'Abc123!*'

  await request(app.getHttpServer()).post('/api/app/tenanties').send({
    name: faker.company.name(),
    document: companyDocument,
    partnerName,
    partnerDocument,
    companyIdentifier,
    phone: faker.phone.number(),
    email
  })

  await new Promise((r) => setTimeout(r, 3000))

  const hashPass = await new HashService().hash(password)
  const connection = await getAllDatabases()
  await connection.query(`
        UPDATE ${companyIdentifier}.user
        SET password = "${hashPass}"
        WHERE email = "${email}"
  `)
  await connection.close()

  return {
    email,
    companyIdentifier,
    companyDocument,
    partnerDocument,
    partnerName,
    password
  }
}
