import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InitModule } from '@/modules/application/app/init.module';
import { createTenant } from '../../../../helpers/create-tenant';
import { loginUser, logoutUser } from '../../../../../e2e/helpers/login-user';
import { faker } from '@faker-js/faker';
import * as request from 'supertest';

jest.mock('@/modules/infra/mail/mail.service');

describe('CustomerController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let tenantData: any;
    let agent: request.SuperTest<request.Test>;
    let customerCreated: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [InitModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        dataSource = moduleFixture.get<DataSource>(DataSource);
        await app.init();
        tenantData = await createTenant(app);
        agent = request.agent(app.getHttpServer());
        await loginUser(agent, {
            email: tenantData.email,
            document: tenantData.companyDocument,
            password: tenantData.password
        });
    });

    afterAll(async () => {
        await logoutUser(agent);
        await dataSource.query('truncate table tenant');
        await dataSource.query(`drop database ${tenantData.companyIdentifier}`);
        await app.close();
    });

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
            const response = await agent.post('/api/customers')
            .send(data);
            expect(response.statusCode).toBe(201);
            const responseBody = response.body;

            customerCreated = responseBody;

            expect(responseBody.id).toBeTruthy();
            expect(responseBody.uuid).toBeTruthy();
            expect(responseBody.name).toEqual(data.name);
            expect(responseBody.phone).toEqual(data.phone);
            expect(responseBody.street).toEqual(data.address.street);
            expect(responseBody.number).toEqual(data.address.number);
            expect(responseBody.neighborhood).toEqual(data.address.neighborhood);
            expect(responseBody.city).toEqual(data.address.city);
            expect(responseBody.state).toEqual(data.address.state);
            expect(responseBody.country).toEqual(data.address.country);
        });
    
        it('Get One (GET)', async () => {
            const response = await agent.get(`/api/customers/${customerCreated.uuid}`);
            expect(response.statusCode).toBe(200);
            const responseBody = response.body;
            expect(responseBody.uuid).toEqual(customerCreated.uuid);
            expect(responseBody.name).toEqual(customerCreated.name);
            expect(responseBody.deletedAt).toBeNull();
        });

        it('List (GET)', async () => {
            const response = await agent.get(`/api/customers`);
            expect(response.statusCode).toBe(200);
            const responseBody = response.body;
            expect(responseBody.length).toBe(1);
            expect(responseBody[0].uuid).toEqual(customerCreated.uuid);
            expect(responseBody[0].name).toEqual(customerCreated.name);
            expect(responseBody[0].deletedAt).toBeNull();
        });

        it('Update (PATCH)', async () => {
            const newName = faker.person.fullName();
            const response = await agent.patch(`/api/customers/${customerCreated.uuid}`).send({
                name: newName
            })
            expect(response.statusCode).toBe(200);
            const responseBody = response.body;

            customerCreated.name = newName;

            expect(responseBody.name).toEqual(newName);
        });

        it('Remove (DELETE)', async () => {
            const response = await agent.delete(`/api/customers/${customerCreated.uuid}`);
            expect(response.statusCode).toBe(200);
            const responseBody = response.body;
            expect(responseBody.deletedAt).toBeTruthy();
        });
    })
});
