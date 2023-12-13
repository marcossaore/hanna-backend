import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { InitModule } from '@/modules/application/app/init.module'
import { createTenant } from '../../../../../e2e/helpers/create-tenant'
import * as request from 'supertest'

jest.mock('@/modules/infra/mail/mail.service')

describe('AuthController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let tenantData: any

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [InitModule]
    }).compile()
    app = moduleFixture.createNestApplication()
    dataSource = moduleFixture.get<DataSource>(DataSource)
    await app.init()
    tenantData = await createTenant(app)
  })

  afterAll(async () => {
    await dataSource.query('truncate table tenant')
    await app.close()
  })

  it('/api/auth/login as admin (Post)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        document: tenantData.companyDocument,
        email: tenantData.email,
        password: tenantData.password
      })
    expect(response.statusCode).toBe(200)
    const responseBody = response.body
    expect(responseBody).toHaveProperty('name', tenantData.partnerName)
    expect(responseBody.permissions).toEqual([
      {
        name: 'sales',
        grants: {
          read: true,
          edit: true,
          create: true,
          delete: true
        },
        options: {
          accountMode: false,
          pinPass: false
        }
      },
      {
        name: 'bathGrooming',
        modules: [
          {
            name: 'schedule',
            grants: {
              read: true,
              edit: true,
              create: true,
              delete: true
            },
            options: {}
          },
          {
            name: 'services',
            grants: {
              read: true,
              edit: true,
              create: true,
              delete: true
            },
            options: {}
          },
          {
            name: 'plans',
            grants: {
              read: true,
              edit: true,
              create: true,
              delete: true
            },
            options: {}
          }
        ]
      },
      {
        name: 'pets',
        grants: {
          read: true,
          edit: true,
          create: true,
          delete: true
        },
        options: {}
      },
      {
        name: 'customers',
        grants: {
          read: true,
          edit: true,
          create: true,
          delete: true
        },
        options: {
          bindPlan: false,
          bill: false
        }
      },
      {
        name: 'products',
        grants: {
          read: true,
          edit: true,
          create: true,
          delete: true
        },
        options: {}
      }
    ])
    expect(responseBody.uuid).toBeTruthy()
  })

  it('/api/auth/logout (Post)', async () => {
    const response = await request(app.getHttpServer()).post('/api/auth/logout')
    expect(response.statusCode).toBe(204)
  })
})
