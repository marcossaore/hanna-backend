import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { Queue } from 'bull';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { mockCompanyEntity, mockCreateCompanyDto } from '../mock/company.mock';
import { AdminCompaniesValidator } from '../../src/company/admin/admin-companies.validator';
import { CompanyService } from '../../src/company/company.service';
import { GenerateUuidService } from '../../src/_common/services/Uuid/generate-uuid-service';
import { CompanyController } from '../../src/company/company.controller';

describe('Controller: Company', () => {
  let sutCompanyController: CompanyController;
  let adminCompaniesValidator: AdminCompaniesValidator;
  let companyService: CompanyService;
  let generateUuidService: GenerateUuidService;
  let createCompanyQueue: Queue;
  let companyEntityMock = mockCompanyEntity();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [
            BullModule.registerQueueAsync({
                name: 'create-company'
            })
        ],
        controllers: [CompanyController],
        providers: [
            {
                provide: AdminCompaniesValidator,
                useValue: {
                    handle: jest.fn().mockResolvedValue(Promise.resolve())
                }
            },
            {
            provide: CompanyService,
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
    .overrideProvider(getQueueToken('create-company'))
    .useValue({ 
        add: jest.fn()
     })
    .compile();

    sutCompanyController = module.get<CompanyController>(CompanyController);
    adminCompaniesValidator = module.get<AdminCompaniesValidator>(AdminCompaniesValidator);
    companyService = module.get<CompanyService>(CompanyService);
    generateUuidService = module.get<GenerateUuidService>(GenerateUuidService);
    createCompanyQueue = module.get<Queue>(getQueueToken('create-company'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('CREATE', () => {

    it('should call AdminCompaniesValidator.handle with correct values', async () => {
        const data = mockCreateCompanyDto()
        await sutCompanyController.create(data);
        expect(adminCompaniesValidator.handle).toHaveBeenCalledTimes(1);
        expect(adminCompaniesValidator.handle).toHaveBeenCalledWith(data.admins);
    });
  
    it('should throws if AdminCompaniesValidator.handle return errors', async () => {
        const data = mockCreateCompanyDto();
        jest.spyOn(adminCompaniesValidator, 'handle').mockResolvedValueOnce(Promise.resolve(new HttpException('some_exception', 1)));
        const promise = sutCompanyController.create(data);
        await expect(promise).rejects.toThrow(new Error('some_exception'));
    });
  
    it('should call CompanyService.exists with correct document', async () => {
      const data = mockCreateCompanyDto()
      await sutCompanyController.create(data);
      expect(companyService.exists).toHaveBeenCalledTimes(1);
      expect(companyService.exists).toHaveBeenCalledWith(data.document);
    });

    it('should throws if CompanyService.exists returns true', async () => {
      const data = mockCreateCompanyDto();
      jest.spyOn(companyService, 'exists').mockReturnValueOnce(Promise.resolve(true));
      const promise = sutCompanyController.create(data);
      await expect(promise).rejects.toThrow(new Error('A empresa já está cadastrada!'));
    });

    it('should throws if CompanyService.exists', async () => {
      const data = mockCreateCompanyDto();
      jest.spyOn(companyService, 'exists').mockImplementationOnce(async() => {
        throw new Error();
      });
      const promise = sutCompanyController.create(data);
      await expect(promise).rejects.toThrow(new Error());
    });

    it('should call CompanyService.existsIdentifier with correct identifier', async () => {
        const data = mockCreateCompanyDto()
        await sutCompanyController.create(data);
        expect(companyService.existsIdentifier).toHaveBeenCalledTimes(1);
        expect(companyService.existsIdentifier).toHaveBeenCalledWith(data.companyIdentifier);
    });

    it('should throws if CompanyService.existsIdentifier returns true', async () => {
        const data = mockCreateCompanyDto();
        jest.spyOn(companyService, 'existsIdentifier').mockReturnValueOnce(Promise.resolve(true));
        const promise = sutCompanyController.create(data);
        await expect(promise).rejects.toThrow(new Error('A identificação já está cadastrada!'));
    });
    
    it('should throws if CompanyService.existsIdentifier throws', async () => {
        const data = mockCreateCompanyDto();
        jest.spyOn(companyService, 'existsIdentifier').mockImplementationOnce(async() => {
          throw new Error();
        });
        const promise = sutCompanyController.create(data);
        await expect(promise).rejects.toThrow(new Error());
    });

    it('should call GenerateUuidService.generate twice: to uuid and apiToken for company entity', async () => {
      const data = mockCreateCompanyDto();
      await sutCompanyController.create(data);
      expect(generateUuidService.generate).toHaveBeenCalledTimes(2);
    });

    it('should call CompanyService.create with correct values', async () => {
      const data = mockCreateCompanyDto();
      await sutCompanyController.create(data);
      expect(companyService.create).toHaveBeenCalledTimes(1);
      expect(companyService.create).toHaveBeenCalledWith({
        ...data,
        apiToken: 'any_uuid',
        uuid: 'any_uuid'
      });
    });

    it('should throws if CompanyService.create throws', async () => {
      const data = mockCreateCompanyDto();
      jest.spyOn(companyService, 'create').mockImplementationOnce(async() => {
          throw new Error();
      });
      const promise = sutCompanyController.create(data);
      await expect(promise).rejects.toThrow(new Error());
    });

    it('should call CreateCompanyQueue.add with correct value', async () => {
        const data = mockCreateCompanyDto();
        await sutCompanyController.create(data);
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
        const response = await sutCompanyController.create(data);
        expect(response).toEqual(companyEntityMock);
    });

    it('should returns a new Company on success', async () => {
      const data = mockCreateCompanyDto();
      const response = await sutCompanyController.create(data);
      expect(response).toEqual(companyEntityMock);
    });
  });
});