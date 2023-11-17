import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { mockCreateCompanyToEntityDto, mockCompanyEntity } from '../mock/company.mock';
import { CompanyService } from '@/company/company.service';
import { Company } from '@db/app/entities/company/company.entity';

const mockError = () => {
    const error = new Error('any_error');
    error.stack = 'stack of any_error';
    return error;
}

describe('Service: Company', () => {
  let sutCompanyService: CompanyService;
  let companyRepository: Repository<Company>;
  let companyEntityMock : Company;

  beforeEach(async () => {
    companyEntityMock = mockCompanyEntity();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(Company),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(companyEntityMock),
            findOne: jest.fn().mockResolvedValue(companyEntityMock),
            save: jest.fn().mockResolvedValue((companyEntityMock))
          }
        }
      ]
    })
    .compile();
    sutCompanyService = module.get<CompanyService>(CompanyService);
    companyRepository = module.get<Repository<Company>>(getRepositoryToken(Company));
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('Exists', () => {
    it('should call RepositoryCompany.findOneBy with correct document', async () => {
        await sutCompanyService.exists('any_document');
        expect(companyRepository.findOneBy).toHaveBeenCalledTimes(1);
        expect(companyRepository.findOneBy).toHaveBeenCalledWith({document: 'any_document'});
    });

    it('should throws if RepositoryCompany.findOneBy throws', async () => {
        jest.spyOn(companyRepository, 'findOneBy').mockImplementationOnce(async() => {
            throw new Error();
        });
        const promise = sutCompanyService.exists('any_document');
        await expect(promise).rejects.toThrow()
    });

    it('should return true if RepositoryCompany.findOneBy find A company', async () => {
        const response = await sutCompanyService.exists('any_document');
        expect(response).toBe(true);
    });

    it('should return false if RepositoryCompany.findOneBy no find any', async () => {
        jest.spyOn(companyRepository, 'findOneBy').mockResolvedValueOnce(null);
        const response = await sutCompanyService.exists('any_document');
        expect(response).toBe(false);
    });
  });

  describe('ExistsIdentifier', () => {
    it('should call RepositoryCompany.findOneBy with correct indentifier', async () => {
        await sutCompanyService.existsIdentifier('any_identifier');
        expect(companyRepository.findOneBy).toHaveBeenCalledTimes(1);
        expect(companyRepository.findOneBy).toHaveBeenCalledWith({companyIdentifier: 'any_identifier'});
    });

    it('should throws if RepositoryCompany.findOneBy throws', async () => {
        jest.spyOn(companyRepository, 'findOneBy').mockImplementationOnce(async() => {
            throw new Error();
        });
        const promise = sutCompanyService.existsIdentifier('any_identifier');
        await expect(promise).rejects.toThrow()
    });

    it('should return true if RepositoryCompany.findOneBy find A company', async () => {
        const response = await sutCompanyService.existsIdentifier('any_identifier');
        expect(response).toBe(true);
    });

    it('should return false if RepositoryCompany.findOneBy no find any', async () => {
        jest.spyOn(companyRepository, 'findOneBy').mockResolvedValueOnce(null);
        const response = await sutCompanyService.existsIdentifier('any_document');
        expect(response).toBe(false);
    });
  });

  describe('Create', () => {
    it('should call RepositoryCompany.save with correct values', async () => {
        const data = mockCreateCompanyToEntityDto();
        await sutCompanyService.create(data);
        expect(companyRepository.save).toHaveBeenCalledTimes(1);
        expect(companyRepository.save).toHaveBeenCalledWith(data);
    });

    it('should throws if RepositoryCompany.save throws', async () => {
        jest.spyOn(companyRepository, 'save').mockImplementationOnce(async() => {
            throw new Error();
        });
        const data = mockCreateCompanyToEntityDto();
        const promise = sutCompanyService.create(data);
        await expect(promise).rejects.toThrow()
    });

    it('should return a company when succeds', async () => {
        const data = mockCreateCompanyToEntityDto();
        const response = await sutCompanyService.create(data);
        expect(response).toEqual(companyEntityMock);
    });
  });

  describe('FindByUuid', () => {
    it('should call RepositoryCompany.findOne with correct values', async () => {
        await sutCompanyService.findByUuid('any_uuid');
        expect(companyRepository.findOne).toHaveBeenCalledTimes(1);
        expect(companyRepository.findOne).toHaveBeenCalledWith({
            where: {
                uuid: 'any_uuid'
            }
        });
    });

    it('should throws if RepositoryCompany.findOne throws', async () => {
        jest.spyOn(companyRepository, 'findOne').mockImplementationOnce(async() => {
            throw new Error();
        });
        const promise = sutCompanyService.findByUuid('any_uuid');
        await expect(promise).rejects.toThrow()
    });

    it('should return null if company not exists', async () => {
        jest.spyOn(companyRepository, 'findOne').mockResolvedValueOnce(null);
        const response = await sutCompanyService.findByUuid('any_uuid');
        expect(response).toEqual(null);
    });

    it('should return a company when succeds', async () => {
        const response = await sutCompanyService.findByUuid('any_uuid');
        expect(response).toEqual(companyEntityMock);
    });
  });

  describe('findByDocument', () => {
    it('should call RepositoryCompany.findOne with correct document', async () => {
        await sutCompanyService.findByDocument('any_document');
        expect(companyRepository.findOne).toHaveBeenCalledTimes(1);
        expect(companyRepository.findOne).toHaveBeenCalledWith({
            where: {
                document: 'any_document'
            }
        });
    });

    it('should throws if RepositoryCompany.findOne throws', async () => {
        jest.spyOn(companyRepository, 'findOne').mockImplementationOnce(async() => {
            throw new Error();
        });
        const promise = sutCompanyService.findByDocument('any_document');
        await expect(promise).rejects.toThrow()
    });

    it('should return null if company not exists', async () => {
        jest.spyOn(companyRepository, 'findOne').mockResolvedValueOnce(null);
        const response = await sutCompanyService.findByDocument('any_document');
        expect(response).toEqual(null);
    });

    it('should return a company when succeds', async () => {
        const response = await sutCompanyService.findByDocument('any_document');
        expect(response).toEqual(companyEntityMock);
    });
  });

  describe('markAsProcessed', () => {
    it('should call RepositoryCompany.findOne with correct values', async () => {
        await sutCompanyService.markAsProcessed('any_uuid');
        expect(companyRepository.findOne).toHaveBeenCalledTimes(1);
        expect(companyRepository.findOne).toHaveBeenCalledWith({
            where: {
                uuid: 'any_uuid'
            }
        });
    });

    it('should throws if RepositoryCompany.findOne throws', async () => {
        jest.spyOn(companyRepository, 'findOne').mockImplementationOnce(async() => {
            throw new Error();
        });
        const promise = sutCompanyService.markAsProcessed('any_uuid');
        await expect(promise).rejects.toThrow()
    });

    it('should call RepositoryCompany.save with correct values', async () => {
        await sutCompanyService.markAsProcessed('any_uuid');
        expect(companyRepository.save).toHaveBeenCalledTimes(1);
        expect(companyRepository.save).toHaveBeenCalledWith(companyEntityMock);
        expect(companyEntityMock.status).toBe('processed');
    });
  });

  describe('markAsRejected', () => {
    it('should call RepositoryCompany.findOne with correct values', async () => {
        await sutCompanyService.markAsRejected('any_uuid', mockError());
        expect(companyRepository.findOne).toHaveBeenCalledTimes(1);
        expect(companyRepository.findOne).toHaveBeenCalledWith({
            where: {
                uuid: 'any_uuid'
            }
        });
    });

    it('should throws if RepositoryCompany.findOne throws', async () => {
        jest.spyOn(companyRepository, 'findOne').mockImplementationOnce(async() => {
            throw new Error();
        });
        const promise = sutCompanyService.markAsRejected('any_uuid', mockError());
        await expect(promise).rejects.toThrow()
    });

    it('should call RepositoryCompany.save with correct values', async () => {
        const error = mockError();
        await sutCompanyService.markAsRejected('any_uuid', error);
        expect(companyRepository.save).toHaveBeenCalledTimes(1);
        expect(companyRepository.save).toHaveBeenCalledWith(companyEntityMock);
        expect(companyEntityMock.status).toBe('rejected');
        expect(companyEntityMock.error).toBe(error.stack);
    });
  });
});