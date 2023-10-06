import { Test, TestingModule } from '@nestjs/testing';
import { Company } from 'src/company/entities/company.entity';
import { mockCompanyEntity } from '../../mock/company.mock';
import { CompanyService } from '../../../src/company/company.service';
import { GenerateDbCredentialsService } from '../../../src/_common/services/Database/generate-db-credentials.service';
import { CreateDatabaseService } from '../../../src/_common/services/Database/create-database.service';
import { EmailService } from '../../../src/_common/services/Email/email.service';
import { CreateCompanyProcessor } from '../../../src/_jobs/consumers/create-company.processor';

const mockJobData: any = { 
    data: { 
        uuid: 'any_uuid'
    }
}

describe('Processor: CreateCompany', () => {
    let companyEntityMock : Company;
    let sutCreateCompanyProcessor: CreateCompanyProcessor;
    let companyService: CompanyService;
    let generateDbCredentialsService: GenerateDbCredentialsService;
    let createDataBaseService: CreateDatabaseService;
    let emailService: EmailService;

    beforeEach(async () => {
        companyEntityMock = mockCompanyEntity();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateCompanyProcessor,
                {
                    provide: CompanyService,
                    useValue: {
                        findByUuid: jest.fn().mockResolvedValue(companyEntityMock)
                    }
                },
                {
                    provide: GenerateDbCredentialsService,
                    useValue: {
                        generate: jest.fn().mockReturnValue({
                            dbUser: 'any_db_user', 
                            dbPass: 'any_db_pass'
                        })
                    }
                },
                {
                    provide: CreateDatabaseService,
                    useValue: {
                        create: jest.fn(null)
                    }
                },
                {
                    provide: EmailService,
                    useValue: {
                        send: jest.fn().mockResolvedValue(true)
                    }
                }
            ]
        })
        .compile();

        sutCreateCompanyProcessor = module.get<CreateCompanyProcessor>(CreateCompanyProcessor);
        companyService = module.get<CompanyService>(CompanyService);
        generateDbCredentialsService = module.get<GenerateDbCredentialsService>(GenerateDbCredentialsService);
        createDataBaseService = module.get<CreateDatabaseService>(CreateDatabaseService);
        emailService = module.get<EmailService>(EmailService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should call CompanyService.findByUuid with correct uuid', async () => {
        await sutCreateCompanyProcessor.handleJob(mockJobData);
        expect(companyService.findByUuid).toHaveBeenCalledTimes(1);
        expect(companyService.findByUuid).toHaveBeenCalledWith('any_uuid');
    });

    it('should call GenerateDbCredentialsService.create', async () => {
        await sutCreateCompanyProcessor.handleJob(mockJobData);
        expect(generateDbCredentialsService.generate).toHaveBeenCalledTimes(1);
    });

    it('should call CreateDatabaseService.create', async () => {
        await sutCreateCompanyProcessor.handleJob(mockJobData);
        expect(createDataBaseService.create).toHaveBeenCalledTimes(1);
        expect(createDataBaseService.create).toHaveBeenCalledWith({
            db: companyEntityMock.companyIdentifier, 
            dbUser: 'any_db_user', 
            dbPass: 'any_db_pass'
        });
    });

    it('should call EmailService.send with correct values', async () => {
        await sutCreateCompanyProcessor.handleJob(mockJobData);
        expect(emailService.send).toHaveBeenCalledTimes(1);
        expect(emailService.send).toHaveBeenCalledWith({
            to: companyEntityMock.email,
            subject: 'Conta criada com sucesso!',
            template: 'company-account-create',
            data: {
                name: companyEntityMock.name,
                document: companyEntityMock.document,
                admins : [
                    {
                        name: companyEntityMock.admins[0].name,
                        email: companyEntityMock.admins[0].email
                    },
                    {
                        name: companyEntityMock.admins[1].name,
                        email: companyEntityMock.admins[1].email
                    }
                ]
            }
        });
    });
});