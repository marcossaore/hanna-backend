import { faker } from '@faker-js/faker';
import { User } from '@infra/db/companies/entities/user/user.entity';

export const mockUserEntity = (): User => ({
    id: faker.number.int(),
    name: faker.company.name(),
    phone: faker.string.numeric({ length: 11 }),
    email: faker.internet.email(),
    uuid: faker.string.uuid(),
    password: faker.string.alphanumeric({ length : 10 }),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    permissions: []
});

export const mockUserPermission = (): any => {
    return [
        {
          id: 1,
          module: {
            name: "sales"
          },
          actions: [
            {
              id: 1,
              name: "read"
            },
            {
              id: 2,
              name: "create"
            },
            {
              id: 3,
              name: "edit"
            },
            {
              id: 4,
              name: "delete"
            }
          ],
          options: [
            {
              id: 1,
              name: "pinPass"
            },
            {
              id: 2,
              name: "accountMode"
            }
          ]
        }
    ]
}