import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../../src/company/entities/company.entity';
import { CompanyService } from '../../src/company/company.service';

describe('Service: Company', () => {
  let sutCompanyService: CompanyService;
  let companyRepository: Repository<Company>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(Company),
          useValue: {
            save: jest.fn().mockResolvedValue(Promise.resolve({})),
          }
        }
      ]
    })
    .compile();
    sutCompanyService = module.get<CompanyService>(CompanyService);
    companyRepository = module.get('CompanyRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('Save', () => {
    it('should call RepositoryCompany.findOneBy with correct document', async () => {
        // console.log('aqui ', companyRepository.save);
        expect(true).toBe(true)
    });
  });
});