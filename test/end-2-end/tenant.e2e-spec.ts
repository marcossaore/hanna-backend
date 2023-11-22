import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/modules/application/app/app.module';
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('TenantController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        const datasource = app.get(DataSource);
        datasource.createQueryBuilder().delete().from(Tenant).execute();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/ (Post)', async () => {
        const response = await request(app.getHttpServer())
        .post('/api/app/tenanties')
        .send({
            name: faker.company.name(),
            document: '78457770000155',
            partnerName: faker.person.fullName(),
            partnerDocument: "43905610060",
            companyIdentifier: faker.string.sample({ min: 6, max: 10 }),
            phone: faker.phone.number(),
            email: faker.internet.email()
        });

        expect(response.status).toBe(202);
        // const responseBody = response.body;
        // expect(responseBody.infoMessage).toEqual('Em breve você receberá um email com instruções de login!');
    });
});
