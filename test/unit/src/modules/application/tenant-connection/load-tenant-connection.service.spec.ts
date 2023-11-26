import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { LoadTenantDataSourceService } from '@/modules/application/tenant-connection/load-tenant-datasource.service';
import { SecretsService } from '@/modules/infra/secrets/secrets-service';
import { LoadTenantConnectionService } from '@/modules/application/tenant-connection/load-tenant-connection.service';
import { ConfigService } from '@nestjs/config';

describe('Service: LoadTenantConnectionService', () => {
    let sutLoadTenantConnectionService: LoadTenantConnectionService;
    let secretsService: SecretsService;
    let loadTenantDataSourceService: LoadTenantDataSourceService;
    let tenantName: string;

    beforeEach(async () => {
        tenantName = faker.company.name();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue({
                            host: 'any_host',
                            port: 'any_port',
                            type: 'any_type',
                        }),
                    },
                },
                {
                    provide: SecretsService,
                    useValue: {
                        get: jest
                            .fn()
                            .mockReturnValue(
                                '{"dbUser": "any_user", "dbPass": "any_pass"}',
                            ),
                    },
                },
                {
                    provide: LoadTenantDataSourceService,
                    useValue: {
                        load: jest.fn().mockReturnValue({} as any),
                    },
                },
                LoadTenantConnectionService,
            ],
        }).compile();

        sutLoadTenantConnectionService =
            module.get<LoadTenantConnectionService>(
                LoadTenantConnectionService,
            );
        secretsService = module.get<SecretsService>(SecretsService);
        loadTenantDataSourceService = module.get<LoadTenantDataSourceService>(
            LoadTenantDataSourceService,
        );
    });

    describe('LoadTenantConnectionService Initialize', () => {
        it('LoadTenantConnectionService should have dbConfig with values provided by ConfigService', async () => {
            const dbConfig = (sutLoadTenantConnectionService as any).dbConfig;
            expect(dbConfig).toEqual({
                host: 'any_host',
                port: 'any_port',
                type: 'any_type',
            });
        });
    });

    describe('load', () => {
        it('should call SecretsService.get with correct value', async () => {
            await sutLoadTenantConnectionService.load(tenantName);
            expect(secretsService.get).toBeCalledWith(tenantName);
            expect(secretsService.get).toBeCalledTimes(1);
        });

        it('should returns null if SecretsService.get returns null', async () => {
            jest.spyOn(secretsService, 'get').mockReturnValueOnce(null);
            const response =
                await sutLoadTenantConnectionService.load(tenantName);
            expect(response).toBe(null);
        });

        it('should returns null if SecretsService.get throws', async () => {
            jest.spyOn(secretsService, 'get').mockImplementationOnce(() => {
                throw new Error();
            });
            const response =
                await sutLoadTenantConnectionService.load(tenantName);
            expect(response).toBe(null);
        });

        it('should call LoadTenantDataSourceService.load with correct values (connectTimeout default 0)', async () => {
            await sutLoadTenantConnectionService.load(tenantName);
            expect(loadTenantDataSourceService.load).toBeCalledWith({
                host: 'any_host',
                port: 'any_port',
                type: 'any_type',
                user: 'any_user',
                password: 'any_pass',
                db: tenantName,
                connectTimeout: 0,
            });
            expect(loadTenantDataSourceService.load).toBeCalledTimes(1);
        });

        it('should call LoadTenantDataSourceService.load with correct values (connectTimeout set 5)', async () => {
            await sutLoadTenantConnectionService.load(tenantName, 5);
            expect(loadTenantDataSourceService.load).toBeCalledWith({
                host: 'any_host',
                port: 'any_port',
                type: 'any_type',
                user: 'any_user',
                password: 'any_pass',
                db: tenantName,
                connectTimeout: 5,
            });
            expect(loadTenantDataSourceService.load).toBeCalledTimes(1);
        });

        it('should returns null if LoadTenantDataSourceService.load throws', async () => {
            jest.spyOn(
                loadTenantDataSourceService,
                'load',
            ).mockImplementationOnce(() => {
                throw new Error();
            });
            const response =
                await sutLoadTenantConnectionService.load(tenantName);
            expect(response).toBe(null);
        });

        it('should returns a Connection when succeds', async () => {
            const response =
                await sutLoadTenantConnectionService.load(tenantName);
            expect(response).toEqual({});
        });
    });
});
