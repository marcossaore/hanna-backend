import { Test, TestingModule } from '@nestjs/testing';
import { mockCompanyEntity, mockCreateCompanyDto } from '../../../../mock/company.mock';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { GenerateUuidService } from '@infra/plugins/uuid/generate-uuid-service';
import { TenantController } from '@/modules/application/tenant/tenant.controller';
import { TenantService } from '@/modules/application/tenant/tenant.service';

describe('Controller: Tenant', () => {
  let sutTenantController: TenantController;
  let tenantService: TenantService;
  let generateUuidService: GenerateUuidService;
  let createCompanyQueue: Queue;
  let companyEntityMock = mockCompanyEntity();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [
            BullModule.registerQueueAsync({
                name: 'create-tenant'
            })
        ],
        controllers: [TenantController],
        providers: [
            {
            provide: TenantService,
                useValue: {
                    exists: jest.fn().mockResolvedValue(Promise.resolve(false)),
                    existsIdentifier: jest.fn().mockResolvedValue(Promise.resolve(false)),
                    create: jest.fn().mockResolvedValue(companyEntityMock)
                }
            },
            {
                provide: GenerateUuidService,
                useValue: {
                    generate: jest.fn().mockReturnValue('any_uuid'),
                }
            }
        ]
    })
    .overrideProvider(getQueueToken('create-tenant'))
    .useValue({ 
        add: jest.fn()
     })
    .compile();

    sutTenantController = module.get<TenantController>(TenantController);
    tenantService = module.get<TenantService>(TenantService);
    generateUuidService = module.get<GenerateUuidService>(GenerateUuidService);
    createCompanyQueue = module.get<Queue>(getQueueToken('create-tenant'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('CREATE', () => {
  
    it('should call TenantService.exists with correct document', async () => {
      const data = mockCreateCompanyDto()
      await sutTenantController.create(data);
      expect(tenantService.exists).toHaveBeenCalledTimes(1);
      expect(tenantService.exists).toHaveBeenCalledWith(data.document);
    });

    it('should throws if TenantService.exists returns true', async () => {
      const data = mockCreateCompanyDto();
      jest.spyOn(tenantService, 'exists').mockReturnValueOnce(Promise.resolve(true));
      const promise = sutTenantController.create(data);
      await expect(promise).rejects.toThrow(new Error('A empresa já está cadastrada!'));
    });

    it('should throws if TenantService.exists', async () => {
      const data = mockCreateCompanyDto();
      jest.spyOn(tenantService, 'exists').mockImplementationOnce(async() => {
        throw new Error();
      });
      const promise = sutTenantController.create(data);
      await expect(promise).rejects.toThrow(new Error());
    });

    it('should call TenantService.existsIdentifier with correct identifier', async () => {
        const data = mockCreateCompanyDto()
        await sutTenantController.create(data);
        expect(tenantService.existsIdentifier).toHaveBeenCalledTimes(1);
        expect(tenantService.existsIdentifier).toHaveBeenCalledWith(data.companyIdentifier);
    });

    it('should throws if TenantService.existsIdentifier returns true', async () => {
        const data = mockCreateCompanyDto();
        jest.spyOn(tenantService, 'existsIdentifier').mockReturnValueOnce(Promise.resolve(true));
        const promise = sutTenantController.create(data);
        await expect(promise).rejects.toThrow(new Error('A identificação já está cadastrada!'));
    });
    
    it('should throws if TenantService.existsIdentifier throws', async () => {
        const data = mockCreateCompanyDto();
        jest.spyOn(tenantService, 'existsIdentifier').mockImplementationOnce(async() => {
          throw new Error();
        });
        const promise = sutTenantController.create(data);
        await expect(promise).rejects.toThrow(new Error());
    });

    it('should call GenerateUuidService.generate twice: to uuid and apiToken for company entity', async () => {
      const data = mockCreateCompanyDto();
      await sutTenantController.create(data);
      expect(generateUuidService.generate).toHaveBeenCalledTimes(1);
    });

    it('should call TenantService.create with correct values', async () => {
      const data = mockCreateCompanyDto();
      await sutTenantController.create(data);
      expect(tenantService.create).toHaveBeenCalledTimes(1);
      expect(tenantService.create).toHaveBeenCalledWith({
        ...data,
        uuid: 'any_uuid'
      });
    });

    it('should throws if TenantService.create throws', async () => {
      const data = mockCreateCompanyDto();
      jest.spyOn(tenantService, 'create').mockImplementationOnce(async() => {
          throw new Error();
      });
      const promise = sutTenantController.create(data);
      await expect(promise).rejects.toThrow(new Error());
    });

    it('should call CreateCompanyQueue.add with correct value', async () => {
        const data = mockCreateCompanyDto();
        await sutTenantController.create(data);
        expect(createCompanyQueue.add).toHaveBeenCalledTimes(1);
        expect(createCompanyQueue.add).toHaveBeenCalledWith({
          uuid: 'any_uuid'
        });
    });

    it('should no throws if CreateCompanyQueue.add throws', async () => {
        const data = mockCreateCompanyDto();
        jest.spyOn(createCompanyQueue, 'add').mockImplementationOnce(() => {
            throw new Error();
        });
        const response = await sutTenantController.create(data);
        expect(response).toEqual(companyEntityMock);
    });

    it('should returns a new Company on success', async () => {
      const data = mockCreateCompanyDto();
      const response = await sutTenantController.create(data);
      expect(response).toEqual(companyEntityMock);
    });
  });
});