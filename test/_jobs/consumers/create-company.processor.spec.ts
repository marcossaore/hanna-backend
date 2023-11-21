import { Test, TestingModule } from '@nestjs/testing';
import { mockCompanyEntity } from '../../mock/company.mock';
import { Company } from '@infra/db/app/entities/company/company.entity';
import { CompanyService } from '@/company/company.service';
import { MigrationsCompanyService } from '@/_common/services/Database/migrations-company.service';
import { AddFirstUserAsAdminService } from '@/_common/services/Database/add-first-user-as-admin.service';
import { GenerateUuidService } from '@/_common/services/Uuid/generate-uuid-service';
import { MailService } from '@/mail/mail.service';
import { SecretsService } from '@/_common/services/Secret/secrets-service';
import { ActionServiceSeed } from '@infra/db/companies/seeds/action.service.seed';
import { ModuleServiceSeed } from '@infra/db/companies/seeds/module.service.seed';
import { CreateDatabaseService } from '@/_common/services/Database/create-database.service';
import { GenerateDbCredentialsService } from '@/_common/services/Database/generate-db-credentials.service';
import { CreateCompanyProcessor } from '@/_jobs/consumers/create-company.processor';

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
    let actionServiceSeed: ActionServiceSeed;
    let moduleServiceSeed: ModuleServiceSeed;
    let mailService: MailService;
    let generateUuidService: GenerateUuidService;
    let addFirstUserAsAdminService: AddFirstUserAsAdminService;
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
                    provide: ActionServiceSeed,
                    useValue: {
                        seed: jest.fn()
                    }
                },
                {
                    provide: ModuleServiceSeed,
                    useValue: {
                        seed: jest.fn()
                    }
                },
                {
                    provide: GenerateUuidService,
                    useValue: {
                        generate: jest.fn().mockReturnValue('any_uuid')
                    }
                },
                {
                    provide: AddFirstUserAsAdminService,
                    useValue: {
                        add: jest.fn()
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
        actionServiceSeed = module.get<ActionServiceSeed>(ActionServiceSeed);
        moduleServiceSeed = module.get<ModuleServiceSeed>(ModuleServiceSeed);
        generateUuidService = module.get<GenerateUuidService>(GenerateUuidService);
        addFirstUserAsAdminService = module.get<AddFirstUserAsAdminService>(AddFirstUserAsAdminService);
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

        it('should call ActionServiceSeed.seed with correct database name', async () => {
            await sutCreateCompanyProcessor.handleJob(mockJobData);
            expect(actionServiceSeed.seed).toHaveBeenCalledTimes(1);
            expect(actionServiceSeed.seed).toHaveBeenCalledWith(companyEntityMock.companyIdentifier);
        });

        it('should throws if ActionServiceSeed.seed throws', async () => {
            jest.spyOn(actionServiceSeed, 'seed').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCreateCompanyProcessor.handleJob(mockJobData);
            await expect(promise).rejects.toThrow();
        });

        it('should call ModuleServiceSeed.seed with correct database name', async () => {
            await sutCreateCompanyProcessor.handleJob(mockJobData);
            expect(moduleServiceSeed.seed).toHaveBeenCalledTimes(1);
            expect(moduleServiceSeed.seed).toHaveBeenCalledWith(companyEntityMock.companyIdentifier);
        });

        it('should throws if ModuleServiceSeed.seed throws', async () => {
            jest.spyOn(moduleServiceSeed, 'seed').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCreateCompanyProcessor.handleJob(mockJobData);
            await expect(promise).rejects.toThrow();
        });

        it('should call GenerateUuidService.generate', async () => {
            await sutCreateCompanyProcessor.handleJob(mockJobData);
            expect(generateUuidService.generate).toHaveBeenCalledTimes(1);
        });
        
        it('should throws if GenerateUuidService.seed throws', async () => {
            jest.spyOn(generateUuidService, 'generate').mockImplementationOnce(() => {
                throw new Error();
            });
            const promise = sutCreateCompanyProcessor.handleJob(mockJobData);
            await expect(promise).rejects.toThrow();
        });

        it('should call AddFirstUserAsAdminService.add', async () => {
            await sutCreateCompanyProcessor.handleJob(mockJobData);
            expect(addFirstUserAsAdminService.add).toHaveBeenCalledTimes(1);
            expect(addFirstUserAsAdminService.add).toHaveBeenCalledWith(
                companyEntityMock.companyIdentifier, 
                {
                    uuid: 'any_uuid',
                    name: companyEntityMock.partnerName,
                    email: companyEntityMock.email,
                    phone: companyEntityMock.phone
                }
            );
        });

        it('should throws if AddFirstUserAsAdminService.add throws', async () => {
            jest.spyOn(addFirstUserAsAdminService, 'add').mockImplementationOnce(() => {
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