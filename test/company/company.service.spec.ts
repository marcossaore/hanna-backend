import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockCompanyDto, mockCompanyEntity } from '../mock/company.mock';

import { Company } from '../../src/company/entities/company.entity';
import { CompanyService } from '../../src/company/company.service';

const mockCreateCompany = () => ({
    ...mockCompanyDto(),
    uuid: 'any_uuid',
    apiToken: 'any_token'
});

describe('Service: Company', () => {
  let sutCompanyService: CompanyService;
  let companyRepository: Repository<Company>;
  let mockCompany = mockCompanyEntity()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(Company),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(Promise.resolve(null)),
            save: jest.fn().mockResolvedValue((mockCompany))
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
        jest.spyOn(companyRepository, 'findOneBy').mockResolvedValueOnce({
            ...mockCompanyEntity()
        });
        const response = await sutCompanyService.exists('any_document');
        expect(response).toBe(true);
    });

    it('should return false if RepositoryCompany.findOneBy no find any', async () => {
        const response = await sutCompanyService.exists('any_document');
        expect(response).toBe(false);
    });
  });

  describe('Create', () => {
    it('should call RepositoryCompany.save with correct values', async () => {
        const data = mockCreateCompany();
        await sutCompanyService.create(data);
        expect(companyRepository.save).toHaveBeenCalledTimes(1);
        expect(companyRepository.save).toHaveBeenCalledWith(data);
    });

    it('should throws if RepositoryCompany.save throws', async () => {
        jest.spyOn(companyRepository, 'save').mockImplementationOnce(async() => {
            throw new Error();
        });
        const data = mockCreateCompany();
        const promise = sutCompanyService.create(data);
        await expect(promise).rejects.toThrow()
    });

    it('should return a company when succeds', async () => {
        const data = mockCreateCompany();
        const response = await sutCompanyService.create(data);
        expect(response).toEqual(mockCompany);
    });
  });
});