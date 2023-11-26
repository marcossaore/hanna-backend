import { Test, TestingModule } from '@nestjs/testing';
import {
    mockCompanyEntity,
    mockCreateCompanyToEntityDto,
} from '../../../../mock/company.mock';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity';
import { TenantService } from '@/modules/application/tenant/tenant.service';

const mockError = () => {
    const error = new Error('any_error');
    error.stack = 'stack of any_error';
    return error;
};

describe('Service: tenant', () => {
    let sutTenantService: TenantService;
    let tenantRepository: Repository<Tenant>;
    let companyEntityMock: Tenant;

    beforeEach(async () => {
        companyEntityMock = mockCompanyEntity();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TenantService,
                {
                    provide: getRepositoryToken(Tenant),
                    useValue: {
                        findOneBy: jest
                            .fn()
                            .mockResolvedValue(companyEntityMock),
                        findOne: jest.fn().mockResolvedValue(companyEntityMock),
                        save: jest.fn().mockResolvedValue(companyEntityMock),
                    },
                },
            ],
        }).compile();
        sutTenantService = module.get<TenantService>(TenantService);
        tenantRepository = module.get<Repository<Tenant>>(
            getRepositoryToken(Tenant),
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Exists', () => {
        it('should call RepositoryTenant.findOneBy with correct document', async () => {
            await sutTenantService.exists('any_document');
            expect(tenantRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(tenantRepository.findOneBy).toHaveBeenCalledWith({
                document: 'any_document',
            });
        });

        it('should throws if RepositoryTenant.findOneBy throws', async () => {
            jest.spyOn(tenantRepository, 'findOneBy').mockImplementationOnce(
                async () => {
                    throw new Error();
                },
            );
            const promise = sutTenantService.exists('any_document');
            await expect(promise).rejects.toThrow();
        });

        it('should return true if RepositoryTenant.findOneBy find A company', async () => {
            const response = await sutTenantService.exists('any_document');
            expect(response).toBe(true);
        });

        it('should return false if RepositoryTenant.findOneBy no find any', async () => {
            jest.spyOn(tenantRepository, 'findOneBy').mockResolvedValueOnce(
                null,
            );
            const response = await sutTenantService.exists('any_document');
            expect(response).toBe(false);
        });
    });

    describe('ExistsIdentifier', () => {
        it('should call RepositoryTenant.findOneBy with correct indentifier', async () => {
            await sutTenantService.existsIdentifier('any_identifier');
            expect(tenantRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(tenantRepository.findOneBy).toHaveBeenCalledWith({
                companyIdentifier: 'any_identifier',
            });
        });

        it('should throws if RepositoryTenant.findOneBy throws', async () => {
            jest.spyOn(tenantRepository, 'findOneBy').mockImplementationOnce(
                async () => {
                    throw new Error();
                },
            );
            const promise = sutTenantService.existsIdentifier('any_identifier');
            await expect(promise).rejects.toThrow();
        });

        it('should return true if RepositoryCompany.findOneBy find A company', async () => {
            const response =
                await sutTenantService.existsIdentifier('any_identifier');
            expect(response).toBe(true);
        });

        it('should return false if RepositoryTenant.findOneBy no find any', async () => {
            jest.spyOn(tenantRepository, 'findOneBy').mockResolvedValueOnce(
                null,
            );
            const response =
                await sutTenantService.existsIdentifier('any_document');
            expect(response).toBe(false);
        });
    });

    describe('Create', () => {
        it('should call RepositoryTenant.save with correct values', async () => {
            const data = mockCreateCompanyToEntityDto();
            await sutTenantService.create(data);
            expect(tenantRepository.save).toHaveBeenCalledTimes(1);
            expect(tenantRepository.save).toHaveBeenCalledWith(data);
        });

        it('should throws if RepositoryTenant.save throws', async () => {
            jest.spyOn(tenantRepository, 'save').mockImplementationOnce(
                async () => {
                    throw new Error();
                },
            );
            const data = mockCreateCompanyToEntityDto();
            const promise = sutTenantService.create(data);
            await expect(promise).rejects.toThrow();
        });

        it('should return a company when succeds', async () => {
            const data = mockCreateCompanyToEntityDto();
            const response = await sutTenantService.create(data);
            expect(response).toEqual(companyEntityMock);
        });
    });

    describe('FindByUuid', () => {
        it('should call RepositoryTenant.findOne with correct values', async () => {
            await sutTenantService.findByUuid('any_uuid');
            expect(tenantRepository.findOne).toHaveBeenCalledTimes(1);
            expect(tenantRepository.findOne).toHaveBeenCalledWith({
                where: {
                    uuid: 'any_uuid',
                },
            });
        });

        it('should throws if RepositoryTenant.findOne throws', async () => {
            jest.spyOn(tenantRepository, 'findOne').mockImplementationOnce(
                async () => {
                    throw new Error();
                },
            );
            const promise = sutTenantService.findByUuid('any_uuid');
            await expect(promise).rejects.toThrow();
        });

        it('should return null if company not exists', async () => {
            jest.spyOn(tenantRepository, 'findOne').mockResolvedValueOnce(null);
            const response = await sutTenantService.findByUuid('any_uuid');
            expect(response).toEqual(null);
        });

        it('should return a company when succeds', async () => {
            const response = await sutTenantService.findByUuid('any_uuid');
            expect(response).toEqual(companyEntityMock);
        });
    });

    describe('findByDocument', () => {
        it('should call RepositoryTenant.findOne with correct document', async () => {
            await sutTenantService.findByDocument('any_document');
            expect(tenantRepository.findOne).toHaveBeenCalledTimes(1);
            expect(tenantRepository.findOne).toHaveBeenCalledWith({
                where: {
                    document: 'any_document',
                },
            });
        });

        it('should throws if RepositoryTenant.findOne throws', async () => {
            jest.spyOn(tenantRepository, 'findOne').mockImplementationOnce(
                async () => {
                    throw new Error();
                },
            );
            const promise = sutTenantService.findByDocument('any_document');
            await expect(promise).rejects.toThrow();
        });

        it('should return null if company not exists', async () => {
            jest.spyOn(tenantRepository, 'findOne').mockResolvedValueOnce(null);
            const response =
                await sutTenantService.findByDocument('any_document');
            expect(response).toEqual(null);
        });

        it('should return a company when succeds', async () => {
            const response =
                await sutTenantService.findByDocument('any_document');
            expect(response).toEqual(companyEntityMock);
        });
    });

    describe('markAsProcessed', () => {
        it('should call RepositoryTenant.findOne with correct values', async () => {
            await sutTenantService.markAsProcessed('any_uuid');
            expect(tenantRepository.findOne).toHaveBeenCalledTimes(1);
            expect(tenantRepository.findOne).toHaveBeenCalledWith({
                where: {
                    uuid: 'any_uuid',
                },
            });
        });

        it('should throws if RepositoryTenant.findOne throws', async () => {
            jest.spyOn(tenantRepository, 'findOne').mockImplementationOnce(
                async () => {
                    throw new Error();
                },
            );
            const promise = sutTenantService.markAsProcessed('any_uuid');
            await expect(promise).rejects.toThrow();
        });

        it('should call RepositoryTenant.save with correct values', async () => {
            await sutTenantService.markAsProcessed('any_uuid');
            expect(tenantRepository.save).toHaveBeenCalledTimes(1);
            expect(tenantRepository.save).toHaveBeenCalledWith(
                companyEntityMock,
            );
            expect(companyEntityMock.status).toBe('processed');
        });
    });

    describe('markAsRejected', () => {
        it('should call RepositoryTenant.findOne with correct values', async () => {
            await sutTenantService.markAsRejected('any_uuid', mockError());
            expect(tenantRepository.findOne).toHaveBeenCalledTimes(1);
            expect(tenantRepository.findOne).toHaveBeenCalledWith({
                where: {
                    uuid: 'any_uuid',
                },
            });
        });

        it('should throws if RepositoryTenant.findOne throws', async () => {
            jest.spyOn(tenantRepository, 'findOne').mockImplementationOnce(
                async () => {
                    throw new Error();
                },
            );
            const promise = sutTenantService.markAsRejected(
                'any_uuid',
                mockError(),
            );
            await expect(promise).rejects.toThrow();
        });

        it('should call RepositoryTenant.save with correct values', async () => {
            const error = mockError();
            await sutTenantService.markAsRejected('any_uuid', error);
            expect(tenantRepository.save).toHaveBeenCalledTimes(1);
            expect(tenantRepository.save).toHaveBeenCalledWith(
                companyEntityMock,
            );
            expect(companyEntityMock.status).toBe('rejected');
            expect(companyEntityMock.error).toBe(error.stack);
        });
    });
});
