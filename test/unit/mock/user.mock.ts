import { faker } from '@faker-js/faker'
import { User } from '@infra/db/companies/entities/user/user.entity'

export const mockUserEntity = (): User => ({
  id: faker.number.int(),
  name: faker.company.name(),
  phone: faker.string.numeric({ length: 11 }),
  email: faker.internet.email(),
  uuid: faker.string.uuid(),
  password: faker.string.alphanumeric({ length: 10 }),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
  role: null
})

export const mockUserPermission = (): any => {
  return [
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
    }
  ]
}

export const mockUserPermissionForRoleGrouped = (): any => ({
  id: 1,
  uuid: faker.string.uuid(),
  name: faker.company.name(),
  role: {
    createdAt: '2023-12-07T23:41:19.000Z',
    updatedAt: '2023-12-07T23:41:19.000Z',
    id: 1,
    name: 'admin',
    permissions: [
      {
        createdAt: '2023-12-07T23:41:19.000Z',
        updatedAt: '2023-12-07T23:41:19.000Z',
        id: 1,
        grants: [
          {
            createdAt: '2023-12-07T23:41:18.000Z',
            updatedAt: '2023-12-07T23:41:18.000Z',
            id: 1,
            name: 'read'
          },
          {
            createdAt: '2023-12-07T23:41:18.000Z',
            updatedAt: '2023-12-07T23:41:18.000Z',
            id: 2,
            name: 'create'
          },
          {
            createdAt: '2023-12-07T23:41:18.000Z',
            updatedAt: '2023-12-07T23:41:18.000Z',
            id: 3,
            name: 'edit'
          },
          {
            createdAt: '2023-12-07T23:41:18.000Z',
            updatedAt: '2023-12-07T23:41:18.000Z',
            id: 4,
            name: 'delete'
          }
        ],
        module: {
          createdAt: '2023-12-07T23:41:19.000Z',
          updatedAt: '2023-12-07T23:41:19.000Z',
          id: 1,
          name: 'sales',
          belongsTo: null
        },
        roleOptions: [
          {
            createdAt: '2023-12-07T23:41:19.000Z',
            updatedAt: '2023-12-07T23:41:19.000Z',
            id: 2,
            isActive: false,
            option: {
              createdAt: '2023-12-07T23:41:19.000Z',
              updatedAt: '2023-12-07T23:41:19.000Z',
              id: 2,
              name: 'accountMode'
            }
          },
          {
            createdAt: '2023-12-07T23:41:19.000Z',
            updatedAt: '2023-12-07T23:41:19.000Z',
            id: 1,
            isActive: true,
            option: {
              createdAt: '2023-12-07T23:41:19.000Z',
              updatedAt: '2023-12-07T23:41:19.000Z',
              id: 1,
              name: 'pinPass'
            }
          }
        ]
      },
      {
        createdAt: '2023-12-07T23:41:19.000Z',
        updatedAt: '2023-12-07T23:41:19.000Z',
        id: 2,
        grants: [
          {
            createdAt: '2023-12-07T23:41:18.000Z',
            updatedAt: '2023-12-07T23:41:18.000Z',
            id: 1,
            name: 'read'
          },
          {
            createdAt: '2023-12-07T23:41:18.000Z',
            updatedAt: '2023-12-07T23:41:18.000Z',
            id: 2,
            name: 'create'
          },
          {
            createdAt: '2023-12-07T23:41:18.000Z',
            updatedAt: '2023-12-07T23:41:18.000Z',
            id: 3,
            name: 'edit'
          },
          {
            createdAt: '2023-12-07T23:41:18.000Z',
            updatedAt: '2023-12-07T23:41:18.000Z',
            id: 4,
            name: 'delete'
          }
        ],
        module: {
          createdAt: '2023-12-07T23:41:19.000Z',
          updatedAt: '2023-12-07T23:41:19.000Z',
          id: 2,
          name: 'schedule',
          belongsTo: 'bathGrooming'
        },
        roleOptions: []
      }
    ]
  }
})
