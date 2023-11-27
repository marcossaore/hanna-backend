import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InitModule } from '@/modules/application/app/init.module';
import { createTenant } from '../../../../../e2e/helpers/create-tenant';
import * as request from 'supertest';

jest.mock('@/modules/infra/mail/mail.service');

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let tenantData: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [InitModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        dataSource = moduleFixture.get<DataSource>(DataSource);
        await app.init();
        tenantData = await createTenant(app);
    });

    afterAll(async () => {
        await dataSource.query('truncate table tenant');
        await app.close();
    });

    it('/api/auth/login (Post)', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({
                document: tenantData.companyDocument,
                email: tenantData.email,
                password: tenantData.password,
            });
        expect(response.statusCode).toBe(200);
        const responseBody = response.body;
        expect(responseBody).toHaveProperty('name', tenantData.partnerName);
        expect(responseBody.permissions).toEqual([
            {
                module: {
                    name: 'sales',
                    grants: [
                        {
                            id: 1,
                            name: 'read',
                        },
                        {
                            id: 2,
                            name: 'create',
                        },
                        {
                            id: 3,
                            name: 'edit',
                        },
                        {
                            id: 4,
                            name: 'delete',
                        },
                    ],
                    options: [
                        {
                            id: 1,
                            name: 'pinPass',
                        },
                        {
                            id: 2,
                            name: 'accountMode',
                        },
                    ],
                },
            },
            {
                module: {
                    name: 'bathGrooming',
                    grants: [
                        {
                            id: 1,
                            name: 'read',
                        },
                        {
                            id: 2,
                            name: 'create',
                        },
                        {
                            id: 3,
                            name: 'edit',
                        },
                        {
                            id: 4,
                            name: 'delete',
                        },
                    ],
                    options: [],
                },
            },
            {
                module: {
                    name: 'schedule',
                    grants: [
                        {
                            id: 1,
                            name: 'read',
                        },
                        {
                            id: 2,
                            name: 'create',
                        },
                        {
                            id: 3,
                            name: 'edit',
                        },
                        {
                            id: 4,
                            name: 'delete',
                        },
                    ],
                    options: [],
                },
            },
            {
                module: {
                    name: 'services',
                    grants: [
                        {
                            id: 1,
                            name: 'read',
                        },
                        {
                            id: 2,
                            name: 'create',
                        },
                        {
                            id: 3,
                            name: 'edit',
                        },
                        {
                            id: 4,
                            name: 'delete',
                        },
                    ],
                    options: [],
                },
            },
            {
                module: {
                    name: 'plans',
                    grants: [
                        {
                            id: 1,
                            name: 'read',
                        },
                        {
                            id: 2,
                            name: 'create',
                        },
                        {
                            id: 3,
                            name: 'edit',
                        },
                        {
                            id: 4,
                            name: 'delete',
                        },
                    ],
                    options: [],
                },
            },
            {
                module: {
                    name: 'pets',
                    grants: [],
                    options: [],
                },
            },
            {
                module: {
                    name: 'customers',
                    grants: [
                        {
                            id: 1,
                            name: 'read',
                        },
                        {
                            id: 2,
                            name: 'create',
                        },
                        {
                            id: 3,
                            name: 'edit',
                        },
                        {
                            id: 4,
                            name: 'delete',
                        },
                    ],
                    options: [
                        {
                            id: 3,
                            name: 'bill',
                        },
                        {
                            id: 4,
                            name: 'bindPlan',
                        },
                    ],
                },
            },
        ]);
        expect(responseBody.uuid).toBeTruthy();
    });

    it('/api/auth/logout (Post)', async () => {
        const response = await request(app.getHttpServer()).post(
            '/api/auth/logout',
        );
        expect(response.statusCode).toBe(204);
    });
});
