import { Test, TestingModule } from '@nestjs/testing';
import { mockAdmin, mockAdminEntity, mockCompanyEntity } from '../../../mock/company.mock';

import { CompanyService } from '../../../../src/company/company.service';
import { AdminCompanyService } from '../../../../src/company/admin-company.service';
import { CreateDatabaseForCompanyService } from '../../../../src/_common/services/Database/create-database-for-company-service';
import { GenerateDbCredentialsService } from '../../../../src/_common/services/Database/generate-db-credentials.service';
import { EmailService } from '../../../../src/_common/services/Email/email.service';
import { CreateDatabaseService } from '../../../../src/_common/services/Database/create-database.service';
import { Company } from 'src/company/entities/company.entity';

describe('Service: CreateDatabaseForCompanyService', () => {

    let companyEntityMock : Company;
    let sutCreateDatabaseForCompanyService: CreateDatabaseForCompanyService;
    let adminCompanyService: AdminCompanyService;
    let companyService: CompanyService;
    let generateDbCredentialsService: GenerateDbCredentialsService;
    let createDataBaseService: CreateDatabaseService;
    let emailService: EmailService;

    beforeEach(async () => {

        companyEntityMock = mockCompanyEntity();

        const module: TestingModule = await Test.createTestingModule({
        providers: [
            CreateDatabaseForCompanyService,
            {
                provide: AdminCompanyService,
                useValue: {
                    createBulk: jest.fn().mockResolvedValue(mockAdminEntity())
                }
            },
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
                        db: 'any_db', 
                        dbUser: 'any_db_user', 
                        dbPass: 'any_db_pass'
                    })
                }
            },
            {
                provide: CreateDatabaseService,
                useValue: {
                    create: jest.fn()
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

        sutCreateDatabaseForCompanyService = module.get<CreateDatabaseForCompanyService>(CreateDatabaseForCompanyService);
        adminCompanyService = module.get<AdminCompanyService>(AdminCompanyService);
        companyService = module.get<CompanyService>(CompanyService);
        generateDbCredentialsService = module.get<GenerateDbCredentialsService>(GenerateDbCredentialsService);
        createDataBaseService = module.get<CreateDatabaseService>(CreateDatabaseService);
        createDataBaseService = module.get<CreateDatabaseService>(CreateDatabaseService);
        emailService = module.get<EmailService>(EmailService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call AdminCompanyService.createBulk with correct values', async () => {
        const admins = [mockAdmin(), mockAdmin()];
        await sutCreateDatabaseForCompanyService.create('any_uuid', admins);
        expect(adminCompanyService.createBulk).toHaveBeenCalledTimes(1);
        expect(adminCompanyService.createBulk).toHaveBeenCalledWith(admins);
    });

    it('should call CompanyService.findByUuid with correct uuid', async () => {
        await sutCreateDatabaseForCompanyService.create('any_uuid', 'any_admin' as any);
        expect(companyService.findByUuid).toHaveBeenCalledTimes(1);
        expect(companyService.findByUuid).toHaveBeenCalledWith('any_uuid');
    });

    it('should call GenerateDbCredentialsService.create', async () => {
        await sutCreateDatabaseForCompanyService.create('any_uuid', 'any_admin' as any);
        expect(generateDbCredentialsService.generate).toHaveBeenCalledTimes(1);
    });

    it('should call CreateDatabaseService.create', async () => {
        await sutCreateDatabaseForCompanyService.create('any_uuid', 'any_admin' as any);
        expect(createDataBaseService.create).toHaveBeenCalledTimes(1);
        expect(createDataBaseService.create).toHaveBeenCalledWith({
            db: 'any_db', 
            dbUser: 'any_db_user', 
            dbPass: 'any_db_pass'
        });
    });

    it('should call EmailService.send with correct values', async () => {
        await sutCreateDatabaseForCompanyService.create('any_uuid', 'any_admin' as any);
        expect(emailService.send).toHaveBeenCalledTimes(1);
        expect(emailService.send).toHaveBeenCalledWith({
            to: companyEntityMock.email,
            subject: 'Conta criada com sucesso!',
            template: 'company-account-create'
        });
    });

});