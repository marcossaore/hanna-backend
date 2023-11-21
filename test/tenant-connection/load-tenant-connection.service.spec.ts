import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { LoadTenantDataSourceService } from '@/modules/application/tenant-connection/load-tenant-datasource.service';
import { SecretsService } from '@/_common/services/Secret/secrets-service';
import { LoadTenantConnectionService } from '@/modules/application/tenant-connection/load-tenant-connection.service';

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
                    provide: 'DB_CONFIG',
                    useValue : {
                        host: 'any_host',
                        port: 1234
                    }
                },
                {
                    provide: SecretsService,
                    useValue : {
                        get: jest.fn().mockReturnValue('{"dbUser": "any_user", "dbPass": "any_pass"}')
                    }
                },
                {
                    provide: LoadTenantDataSourceService,
                    useValue: {
                        load: jest.fn().mockReturnValue({} as any)
                    }
                },
                LoadTenantConnectionService
            ],
        }).compile();

        sutLoadTenantConnectionService = module.get<LoadTenantConnectionService>(LoadTenantConnectionService);
        secretsService = module.get<SecretsService>(SecretsService);
        loadTenantDataSourceService = module.get<LoadTenantDataSourceService>(LoadTenantDataSourceService);
    });

    describe('load', () => {
        it('should call SecretsService.get with correct value', async () => {
            await sutLoadTenantConnectionService.load(tenantName);
            expect(secretsService.get).toBeCalledWith(tenantName);
            expect(secretsService.get).toBeCalledTimes(1);
        });
    
        it('should returns null if SecretsService.get returns null', async () => {
            jest.spyOn(secretsService, 'get').mockReturnValueOnce(null);
            const response = await sutLoadTenantConnectionService.load(tenantName);
            expect(response).toBe(null);
        });
    
        it('should returns null if SecretsService.get throws', async () => {
            jest.spyOn(secretsService, 'get').mockImplementationOnce(() => {
                throw new Error();
            })
            const response = await sutLoadTenantConnectionService.load(tenantName);
            expect(response).toBe(null);
        });

        it('should call LoadTenantDataSourceService.load with correct values', async () => {
            await sutLoadTenantConnectionService.load(tenantName);
            expect(loadTenantDataSourceService.load).toBeCalledWith({
                host: 'any_host',
                port: 1234,
                user: 'any_user',
                password: 'any_pass',
                db: tenantName
            });
            expect(loadTenantDataSourceService.load).toBeCalledTimes(1);
        });

        it('should returns null if LoadTenantDataSourceService.load throws', async () => {
            jest.spyOn(loadTenantDataSourceService, 'load').mockImplementationOnce(() => {
                throw new Error();
            })
            const response = await sutLoadTenantConnectionService.load(tenantName);
            expect(response).toBe(null);
        });

        it('should returns a Connection when succeds', async () => {
            const response = await sutLoadTenantConnectionService.load(tenantName);
            expect(response).toEqual({});
        });
    })

});
