import { Test, TestingModule } from '@nestjs/testing';
import { mockCompanyEntity } from '../../../mock/company.mock';
import { Company } from '../../../../src/company/entities/company.entity';
import { CompanyService } from '../../../../src/company/company.service';
import { CreateDatabaseForCompanyService } from '../../../../src/_common/services/Database/create-database-for-company-service';
import { GenerateDbCredentialsService } from '../../../../src/_common/services/Database/generate-db-credentials.service';
import { EmailService } from '../../../../src/_common/services/Email/email.service';
import { CreateDatabaseService } from '../../../../src/_common/services/Database/create-database.service';

describe('Service: CreateDatabaseForCompanyService', () => {

    let companyEntityMock : Company;
    let sutCreateDatabaseForCompanyService: CreateDatabaseForCompanyService;
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
        companyService = module.get<CompanyService>(CompanyService);
        generateDbCredentialsService = module.get<GenerateDbCredentialsService>(GenerateDbCredentialsService);
        createDataBaseService = module.get<CreateDatabaseService>(CreateDatabaseService);
        createDataBaseService = module.get<CreateDatabaseService>(CreateDatabaseService);
        emailService = module.get<EmailService>(EmailService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call CompanyService.findByUuid with correct uuid', async () => {
        await sutCreateDatabaseForCompanyService.create('any_uuid');
        expect(companyService.findByUuid).toHaveBeenCalledTimes(1);
        expect(companyService.findByUuid).toHaveBeenCalledWith('any_uuid');
    });

    it('should call GenerateDbCredentialsService.create', async () => {
        await sutCreateDatabaseForCompanyService.create('any_uuid');
        expect(generateDbCredentialsService.generate).toHaveBeenCalledTimes(1);
    });

    it('should call CreateDatabaseService.create', async () => {
        await sutCreateDatabaseForCompanyService.create('any_uuid');
        expect(createDataBaseService.create).toHaveBeenCalledTimes(1);
        expect(createDataBaseService.create).toHaveBeenCalledWith({
            db: 'any_db', 
            dbUser: 'any_db_user', 
            dbPass: 'any_db_pass'
        });
    });

    it('should call EmailService.send with correct values', async () => {
        await sutCreateDatabaseForCompanyService.create('any_uuid');
        expect(emailService.send).toHaveBeenCalledTimes(1);
        expect(emailService.send).toHaveBeenCalledWith({
            to: companyEntityMock.email,
            subject: 'Conta criada com sucesso!',
            template: 'company-account-create'
        });
    });

});