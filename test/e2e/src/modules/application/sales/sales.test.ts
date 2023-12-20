import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { InitModule } from '@/modules/application/app/init.module'
import { createTenant } from '../../../../helpers/create-tenant'
import { loginUser, logoutUser } from '../../../../helpers/login-user'
import { createProducts } from '../../../../helpers/create-products'
import * as request from 'supertest'

jest.mock('@/modules/infra/mail/mail.service')

describe('SalesController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let tenantData: any
  let agent: request.SuperTest<request.Test>

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [InitModule]
    }).compile()
    app = moduleFixture.createNestApplication()
    dataSource = moduleFixture.get<DataSource>(DataSource)
    await app.init()
    await dataSource.query('truncate table tenant')
    tenantData = await createTenant(app)
    await createProducts(tenantData.companyIdentifier)
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

  describe('/api/sales', () => {
    it('Create (POST)', async () => {
      const data = {
        paymentMethod: 'money',
        orders: [
          {
            productId: 1,
            quantity: 2
          },
          {
            productId: 2,
            quantity: 1
          },
          {
            productId: 3,
            quantity: 2000
          }
        ]
      }
      const response = await agent.post('/api/sales').send(data)
      expect(response.statusCode).toBe(201)
    })
  })
})
