import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { InitModule } from '@/modules/application/app/init.module'
import { createTenant } from '../../../../helpers/create-tenant'
import { loginUser, logoutUser } from '../../../../../e2e/helpers/login-user'
import { createAppBucket } from '../../../../../e2e/helpers/create-app-bucket'
import { faker } from '@faker-js/faker'
import * as request from 'supertest'
import { resolve } from 'path'

jest.mock('@/modules/infra/mail/mail.service')

describe('CustomerController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let tenantData: any
  let agent: request.SuperTest<request.Test>
  let customerCreated: any
  let customerCreatedWithThumb: any

  beforeAll(async () => {
    await createAppBucket()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [InitModule]
    }).compile()
    app = moduleFixture.createNestApplication()
    dataSource = moduleFixture.get<DataSource>(DataSource)
    await app.init()
    await dataSource.query('truncate table tenant')
    tenantData = await createTenant(app)
    agent = request.agent(app.getHttpServer())
    await loginUser(agent, {
      email: tenantData.email,
      document: tenantData.companyDocument,
      password: tenantData.password
    })
  })

  afterAll(async () => {
    await logoutUser(agent)
    await dataSource.query('truncate table tenant')
    await dataSource.query(`drop database ${tenantData.companyIdentifier}`)
    await app.close()
  })

  describe('/api/customers', () => {
    it('Create (POST)', async () => {
      const data = {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        address: {
          street: faker.location.street(),
          number: faker.location.buildingNumber(),
          neighborhood: faker.location.secondaryAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country()
        }
      }
      const response = await agent.post('/api/customers').send(data)
      expect(response.statusCode).toBe(201)
      const responseBody = response.body

      customerCreated = responseBody

      expect(responseBody.id).toBeTruthy()
      expect(responseBody.uuid).toBeTruthy()
      expect(responseBody.name).toEqual(data.name)
      expect(responseBody.phone).toEqual(data.phone)
      expect(responseBody.street).toEqual(data.address.street)
      expect(responseBody.number).toEqual(data.address.number)
      expect(responseBody.neighborhood).toEqual(data.address.neighborhood)
      expect(responseBody.city).toEqual(data.address.city)
      expect(responseBody.state).toEqual(data.address.state)
      expect(responseBody.country).toEqual(data.address.country)
      expect(responseBody.thumb).toBeNull()
    })

    it('Create (POST) with thumb ', async () => {
      const relativeFilePath = './test.png'
      const absoluteFilePath = resolve(__dirname, relativeFilePath)
      const response = await agent
        .post('/api/customers')
        .field('name', faker.person.fullName())
        .field('phone', faker.phone.number())
        .field('address[street]', faker.location.street())
        .field('address[number]', faker.location.buildingNumber())
        .field('address[neighborhood]', faker.location.secondaryAddress())
        .field('address[city]', faker.location.city())
        .field('address[state]', faker.location.state())
        .field('address[country]', faker.location.country())
        .attach('thumb', absoluteFilePath)

      expect(response.statusCode).toBe(201)

      const responseBody = response.body
      customerCreatedWithThumb = responseBody

      expect(responseBody.uuid).toBeTruthy()
      expect(response.body.id).toBeTruthy()
      expect(response.body.thumb).toBeTruthy()
    })

    it('Get One (GET)', async () => {
      const response = await agent.get(`/api/customers/${customerCreated.uuid}`)
      expect(response.statusCode).toBe(200)
      const responseBody = response.body
      expect(responseBody.uuid).toEqual(customerCreated.uuid)
      expect(responseBody.name).toEqual(customerCreated.name)
      expect(responseBody.thumb).toBeNull()
      expect(responseBody.deletedAt).toBeNull()
    })

    it('Get One thumb (GET)', async () => {
      const response = await agent.get(
        `/api/customers/${customerCreatedWithThumb.uuid}`
      )
      expect(response.statusCode).toBe(200)
      const responseBody = response.body
      expect(responseBody.uuid).toEqual(customerCreatedWithThumb.uuid)
      expect(responseBody.name).toEqual(customerCreatedWithThumb.name)
      expect(responseBody.thumb).toBeTruthy()
      expect(responseBody.deletedAt).toBeNull()
      expect(responseBody.thumb).toBeTruthy()
    })

    it('List (GET)', async () => {
      const response = await agent.get(`/api/customers`)
      expect(response.statusCode).toBe(200)
      const responseBody = response.body
      expect(responseBody.page).toBe(1)
      expect(responseBody.totalPage).toBe(1)
      expect(responseBody.items.length).toBe(2)
      expect(responseBody.items[0].uuid).toEqual(customerCreated.uuid)
      expect(responseBody.items[0].thumb).toBeNull()
      expect(responseBody.items[1].uuid).toEqual(customerCreatedWithThumb.uuid)
      expect(responseBody.items[1].thumb).toBeTruthy()
    })

    it('Update (PATCH)', async () => {
      const newName = faker.person.fullName()
      const response = await agent
        .patch(`/api/customers/${customerCreated.uuid}`)
        .send({
          name: newName
        })
      expect(response.statusCode).toBe(200)
      const responseBody = response.body

      customerCreated.name = newName

      expect(responseBody.name).toEqual(newName)
    })

    it('Update (PATCH) thumb', async () => {
      const relativeFilePath = './test.png'
      const absoluteFilePath = resolve(__dirname, relativeFilePath)
      await agent
        .patch(`/api/customers/${customerCreated.uuid}`)
        .attach('thumb', absoluteFilePath)
        .expect(200)
        .then((response) => {
          expect(response.body.thumb).toBeTruthy()
        })
    })

    it('Remove (DELETE)', async () => {
      const response = await agent.delete(
        `/api/customers/${customerCreated.uuid}`
      )
      expect(response.statusCode).toBe(200)
      const responseBody = response.body
      expect(responseBody.deletedAt).toBeTruthy()
    })
  })
})
