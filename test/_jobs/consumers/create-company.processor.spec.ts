import { Test, TestingModule } from '@nestjs/testing';
import { Company } from 'db/app/entities/company/company.entity';
import { mockCompanyEntity } from '../../mock/company.mock';
import { CompanyService } from '../../../src/company/company.service';
import { GenerateDbCredentialsService } from '../../../src/_common/services/Database/generate-db-credentials.service';
import { CreateDatabaseService } from '../../../src/_common/services/Database/create-database.service';
import { CreateCompanyProcessor } from '../../../src/_jobs/consumers/create-company.processor';
import { SecretsService } from '../../../src/_common/services/Secret/secrets-service';
import { MigrationsCompanyService } from '../../../src/_common/services/Database/migrations-company.service';
import { MailService } from '../../../src/mail/mail.service';

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
    let secretsService: SecretsService;
    let mailService: MailService;
    let migrationsCompanyService: MigrationsCompanyService;

    beforeEach(async () => {
        companyEntityMock = mockCompanyEntity();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateCompanyProcessor,
                {
                    provide: CompanyService,
                    useValue: {
                        findByUuid: jest.fn().mockResolvedValue(companyEntityMock),
                        markAsProcessed: jest.fn(),
                        markAsRejected: jest.fn(),
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
                    provide: SecretsService,
                    useValue: {
                        save: jest.fn()
                    }
                },
                {
                    provide: MigrationsCompanyService,
                    useValue: {
                        run: jest.fn()
                    }
                },
                {
                    provide: MailService,
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
        secretsService = module.get<SecretsService>(SecretsService);
        mailService = module.get<MailService>(MailService);
        migrationsCompanyService = module.get<MigrationsCompanyService>(MigrationsCompanyService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('handleJob', () => {
        it('should call CompanyService.findByUuid with correct uuid', async () => {
            await sutCreateCompanyProcessor.handleJob(mockJobData);
            expect(companyService.findByUuid).toHaveBeenCalledTimes(1);
            expect(companyService.findByUuid).toHaveBeenCalledWith('any_uuid');
        });
    
        it('should throws if CompanyService.findByUuid throws', async () => {
            jest.spyOn(companyService, 'findByUuid').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCreateCompanyProcessor.handleJob(mockJobData);
            await expect(promise).rejects.toThrow();
        });
    
        it('should call GenerateDbCredentialsService.generate', async () => {
            await sutCreateCompanyProcessor.handleJob(mockJobData);
            expect(generateDbCredentialsService.generate).toHaveBeenCalledTimes(1);
            expect(generateDbCredentialsService.generate).toHaveBeenCalledWith(companyEntityMock.name);
        });
    
        it('should throws if GenerateDbCredentialsService.generate throws', async () => {
            jest.spyOn(generateDbCredentialsService, 'generate').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCreateCompanyProcessor.handleJob(mockJobData);
            await expect(promise).rejects.toThrow();
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
    
        it('should throws if CreateDatabaseService.create throws', async () => {
            jest.spyOn(createDataBaseService, 'create').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCreateCompanyProcessor.handleJob(mockJobData);
            await expect(promise).rejects.toThrow();
        });
    
        it('should call SecretsService.save with correct values', async () => {
            await sutCreateCompanyProcessor.handleJob(mockJobData);
            expect(secretsService.save).toHaveBeenCalledTimes(1);
            expect(secretsService.save).toHaveBeenCalledWith(companyEntityMock.companyIdentifier, JSON.stringify({
                dbUser: 'any_db_user', 
                dbPass: 'any_db_pass'
            }));
        });
    
        it('should throws if SecretsService.save throws', async () => {
            jest.spyOn(secretsService, 'save').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCreateCompanyProcessor.handleJob(mockJobData);
            await expect(promise).rejects.toThrow();
        });

        it('should call MigrationsCompanyService.run with correct value', async () => {
            await sutCreateCompanyProcessor.handleJob(mockJobData);
            expect(migrationsCompanyService.run).toHaveBeenCalledTimes(1);
            expect(migrationsCompanyService.run).toHaveBeenCalledWith(companyEntityMock.companyIdentifier);
        });

        it('should throws if MigrationsCompanyService.run throws', async () => {
            jest.spyOn(migrationsCompanyService, 'run').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCreateCompanyProcessor.handleJob(mockJobData);
            await expect(promise).rejects.toThrow();
        });

    
        it('should call MailService.send with correct values', async () => {
            await sutCreateCompanyProcessor.handleJob(mockJobData);
            expect(mailService.send).toHaveBeenCalledTimes(1);
            expect(mailService.send).toHaveBeenCalledWith({
                to: companyEntityMock.email,
                subject: 'Conta criada com sucesso!',
                template: 'company-account-create',
                data: {
                    name: companyEntityMock.name,
                    document: companyEntityMock.document,
                    partnerName: companyEntityMock.partnerName,
                    email: companyEntityMock.email
                }
            });
        });
    
        it('should throws if MailService.send throws', async () => {
            jest.spyOn(mailService, 'send').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCreateCompanyProcessor.handleJob(mockJobData);
            await expect(promise).rejects.toThrow();
        });
    })

    describe('onCompleted', () => {
        it('should call CompanyService.markAsProcessed with correct values', () => {
            sutCreateCompanyProcessor.onCompleted(mockJobData);
            expect(companyService.markAsProcessed).toHaveBeenCalledTimes(1);
            expect(companyService.markAsProcessed).toHaveBeenCalledWith('any_uuid');
        });
    });

    describe('onFailed', () => {
        it('should call CompanyService.markAsRejected with correct values', () => {
            sutCreateCompanyProcessor.onFailed(mockJobData, new Error('Some error occurs!'));
            expect(companyService.markAsRejected).toHaveBeenCalledTimes(1);
            expect(companyService.markAsRejected).toHaveBeenCalledWith('any_uuid', new Error('Some error occurs!'));
        });
    })
});