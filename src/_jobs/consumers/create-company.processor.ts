import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { MailService } from '@/mail/mail.service';
import { GenerateUuidService } from '@/_common/services/Uuid/generate-uuid-service';
import { UserServiceLazy } from '@/user/user.service.lazy';
import { MigrationsCompanyService } from '@/_common/services/Database/migrations-company.service';
import { SecretsService } from '@/_common/services/Secret/secrets-service';
import { CreateDatabaseService } from '@/_common/services/Database/create-database.service';
import { GenerateDbCredentialsService } from '@/_common/services/Database/generate-db-credentials.service';
import { CompanyService } from '@/company/company.service';
import { SeedRunnerService } from '@db/companies/seeds/seed-runner.service.';
import { LoadTenantConnectionService } from '@/tenant-connection/load-tenant-connection.service';
import { AddAdminRoleServiceLazy } from '@/role/add-admin-role.service';

@Injectable()
@Processor('create-company')
export class  CreateCompanyProcessor {

    constructor(
        private readonly seedRunnerService: SeedRunnerService,
        private readonly companyService: CompanyService,
        private readonly generateDbCredentialsService: GenerateDbCredentialsService,
        private readonly createDatabaseService: CreateDatabaseService,
        private readonly secretsService: SecretsService,
        private readonly migrationsCompanyService: MigrationsCompanyService,
        private readonly userService: UserServiceLazy,
        private readonly adminRoleService: AddAdminRoleServiceLazy,
        private readonly generateUuidService: GenerateUuidService,
        private readonly loadTenantConnectionService: LoadTenantConnectionService,
        private readonly mailService: MailService
    ){}

    @Process()
    async handleJob(job: Job) {

        try {   
            const company = await this.companyService.findByUuid(job.data.uuid);
            const credentials = this.generateDbCredentialsService.generate(company.name);
            await this.createDatabaseService.create({
                db: company.companyIdentifier,
                ...credentials
            });
            await this.secretsService.save(
                company.companyIdentifier,    
                JSON.stringify({
                    ...credentials
                })
            );
            
            const connection = await this.loadTenantConnectionService.load(company.companyIdentifier, 5);
            if (!connection) {
                throw new Error('Connection it was not established!');
            }

            await this.migrationsCompanyService.run(company.companyIdentifier);
            await this.seedRunnerService.seed(connection);

            const userService = this.userService.load(connection);
            const uuid = this.generateUuidService.generate();

            const user = await userService.save({
                uuid,
                name: company.partnerName,
                email: company.email,
                phone: company.phone
            });

            const adminRoleService = this.adminRoleService.load(connection);
            userService.addRole(user.uuid, adminRoleService);
    
            await this.mailService.send({
                to: company.email,
                subject: 'Conta criada com sucesso!',
                template: 'company-account-create',
                data: {
                    name: company.name,
                    document: company.document,
                    partnerName: company.partnerName,
                    email: company.email
                }
            });
        } catch (error) {
           throw error; 
        }
    }

    @OnQueueCompleted()
    onCompleted(job: Job) {
        this.companyService.markAsProcessed(job.data.uuid);
    }
  
    @OnQueueFailed()
    onFailed(job: Job, error: Error) {
        this.companyService.markAsRejected(job.data.uuid, error);
    }
}