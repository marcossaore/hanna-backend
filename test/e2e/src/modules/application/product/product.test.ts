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

describe('ProductController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let tenantData: any
  let agent: request.SuperTest<request.Test>
  let productCreated: any
  let productCreatedWithThumb: any

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

  describe('/api/products', () => {
    it('Create (POST)', async () => {
      const data = {
        name: faker.person.fullName(),
        price: 3640,
        quantity: 3
      }
      const response = await agent.post('/api/products').send(data)
      expect(response.statusCode).toBe(201)

      const responseBody = response.body
      productCreated = responseBody

      expect(responseBody.id).toBeTruthy()
      expect(responseBody.name).toEqual(data.name)
      expect(responseBody.price).toEqual(data.price)
      expect(responseBody.thumb).toBeNull()
    })

    it('Create with thumb (POST)', async () => {
      const relativeFilePath = './test.png'
      const absoluteFilePath = resolve(__dirname, relativeFilePath)
      const response = await agent
        .post('/api/products')
        .field('name', faker.person.fullName())
        .field('price', 25000)
        .field('code', 'any_code')
        .field('quantity', 3)
        .attach('thumb', absoluteFilePath)

      expect(response.statusCode).toBe(201)

      const responseBody = response.body
      productCreatedWithThumb = responseBody

      expect(response.body.id).toBeTruthy()
      expect(response.body.thumb).toBeTruthy()
    })

    it('Create bulk (POST)', async () => {
      const response = await agent
        .post('/api/products')
        .field('name', faker.person.fullName())
        .field('price', 34000)
        .field('bulkPrice', 3890)
        .field('quantity', 3)
        .field('quantityKg', 12)
        .field('quantityKgActual', 5.6)
      const responseBody = response.body

      expect(responseBody.id).toBeTruthy()
      expect(responseBody.quantityKg).toEqual('12')
      expect(responseBody.quantityKgActual).toBe(5.6)
    })

    it('Get One (GET)', async () => {
      const response = await agent.get(`/api/products/${productCreated.id}`)
      expect(response.statusCode).toBe(200)
      const responseBody = response.body
      expect(responseBody.id).toEqual(productCreated.id)
      expect(responseBody.name).toEqual(productCreated.name)
      expect(responseBody.thumb).toBeNull()
      expect(responseBody.deletedAt).toBeNull()
    })

    it('Get One thumb (GET)', async () => {
      const response = await agent.get(
        `/api/products/${productCreatedWithThumb.id}`
      )
      expect(response.statusCode).toBe(200)
      const responseBody = response.body
      expect(responseBody.id).toEqual(productCreatedWithThumb.id)
      expect(responseBody.name).toEqual(productCreatedWithThumb.name)
      expect(responseBody.deletedAt).toBeNull()
      expect(responseBody.thumb).toBeTruthy()
    })

    it('List (GET)', async () => {
      const response = await agent.get(`/api/products`)
      expect(response.statusCode).toBe(200)
      const responseBody = response.body
      expect(responseBody.page).toBe(1)
      expect(responseBody.totalPage).toBe(1)
      expect(responseBody.items.length).toBe(3)
    })

    it('Update (PATCH)', async () => {
      const newName = faker.person.fullName()
      const response = await agent
        .patch(`/api/products/${productCreated.id}`)
        .send({
          name: newName
        })
      expect(response.statusCode).toBe(200)
      const responseBody = response.body

      productCreated.name = newName

      expect(responseBody.name).toEqual(newName)
    })

    it('Update (PATCH) thumb', async () => {
      const relativeFilePath = './test.png'
      const absoluteFilePath = resolve(__dirname, relativeFilePath)
      await agent
        .patch(`/api/products/${productCreated.id}`)
        .field('name', 'any_name')
        .field('price', 10000)
        .attach('thumb', absoluteFilePath)
        .expect(200)
        .then((response) => {
          expect(response.body.thumb).toBeTruthy()
        })
    })

    it('Remove (DELETE)', async () => {
      const response = await agent.delete(`/api/products/${productCreated.id}`)
      expect(response.statusCode).toBe(200)
      const responseBody = response.body
      expect(responseBody.deletedAt).toBeTruthy()
    })
  })
})
