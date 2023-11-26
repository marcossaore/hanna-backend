import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { getAllDatabases } from './helpers/connections';
import { AppModule } from '@/modules/application/app/app.module';
import { faker } from '@faker-js/faker';
import * as request from 'supertest';

jest.mock('@/modules/infra/mail/mail.service');

const getTenant = async (dataSource: DataSource) => {
    const tenant = await dataSource.query(`select * from tenant where status = "processed"`);
    return tenant[0] || null;
}  

describe('TenantController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        dataSource = moduleFixture.get<DataSource>(DataSource);
        await app.init();
    });

    afterEach(async () => {
        await dataSource.query('truncate table tenant');
    })

    afterAll(async () => {
        await app.close();
    });

    it('/api/app/tenanties (Post)', async () => {
        const email =  faker.internet.email();
        const companyIdentifier = faker.string.alphanumeric({ length: 10});
        const response = await request(app.getHttpServer())
        .post('/api/app/tenanties')
        .send({
            name: faker.company.name(),
            document: '78457770000155',
            partnerName: faker.person.fullName(),
            partnerDocument: "43905610060",
            companyIdentifier,
            phone: faker.phone.number(),
            email
        });
        expect(response.statusCode).toBe(202);
        const responseBody = response.body;
        expect(responseBody.infoMessage).toEqual('Em breve você receberá um email com instruções de login!');
        await new Promise((r) => setTimeout(r, 3000));
        let tenant = await getTenant(dataSource);
        if (!tenant) {
            await new Promise((r) => setTimeout(r, 3000));
            tenant = await getTenant(dataSource);
        }
        if (!tenant) {
            await new Promise((r) => setTimeout(r, 3000));
            tenant = await getTenant(dataSource);
        }
        expect(tenant).toHaveProperty('status', 'processed');
        expect(tenant).toHaveProperty('error', null);
        const connection = await getAllDatabases();
        const userCreated = await connection.query(`select * from ${companyIdentifier}.user where email = "${email}"`);
        expect(userCreated[0].uuid).toBeTruthy();
        const roleCreated = await connection.query(`select * from ${companyIdentifier}.rbac_role where name = "admin"`);
        expect(roleCreated[0].name === 'admin').toBe(true);
        expect(userCreated[0].roleId === roleCreated[0].id).toBe(true);
    });
});
