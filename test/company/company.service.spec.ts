import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { mockCreateCompanyToEntityDto, mockCompanyEntity } from '../mock/company.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from '../../src/company/entities/company.entity';
import { CompanyService } from '../../src/company/company.service';

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
    it('should call RepositoryCompany.findOneBy with correct uuid', async () => {
        await sutCompanyService.findByUuid('any_uuid');
        expect(companyRepository.findOneBy).toHaveBeenCalledTimes(1);
        expect(companyRepository.findOneBy).toHaveBeenCalledWith({
            uuid: 'any_uuid'
        });
    });

    it('should throws if RepositoryCompany.findOneBy throws', async () => {
        jest.spyOn(companyRepository, 'findOneBy').mockImplementationOnce(async() => {
            throw new Error();
        });
        const promise = sutCompanyService.findByUuid('any_uuid');
        await expect(promise).rejects.toThrow()
    });

    it('should return null if company not exists', async () => {
        jest.spyOn(companyRepository, 'findOneBy').mockResolvedValueOnce(null);
        const response = await sutCompanyService.findByUuid('any_uuid');
        expect(response).toEqual(null);
    });

    it('should return a company when succeds', async () => {
        const response = await sutCompanyService.findByUuid('any_uuid');
        expect(response).toEqual(companyEntityMock);
    });
  });
});