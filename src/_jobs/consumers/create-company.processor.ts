import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { MailService } from '@/mail/mail.service';
import { GenerateUuidService } from '@/_common/services/Uuid/generate-uuid-service';
import { AddFirstUserAsAdminService } from '@/_common/services/Database/add-first-user-as-admin.service';
import { MigrationsCompanyService } from '@/_common/services/Database/migrations-company.service';
import { SecretsService } from '@/_common/services/Secret/secrets-service';
import { CreateDatabaseService } from '@/_common/services/Database/create-database.service';
import { GenerateDbCredentialsService } from '@/_common/services/Database/generate-db-credentials.service';
import { CompanyService } from '@/company/company.service';
import { SeedRunnerService } from '@db/companies/seeds/seed-runner.service.';


@Injectable()
@Processor('create-company')
export class CreateCompanyProcessor {

    constructor(
        private readonly seedRunnerService: SeedRunnerService,
        private readonly companyService: CompanyService,
        private readonly generateDbCredentialsService: GenerateDbCredentialsService,
        private readonly createDatabaseService: CreateDatabaseService,
        private readonly secretsService: SecretsService,
        private readonly migrationsCompanyService: MigrationsCompanyService,
        private readonly addFirstUserAsAdminService: AddFirstUserAsAdminService,
        private readonly generateUuidService: GenerateUuidService,
        private readonly mailService: MailService,
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
    
            await this.migrationsCompanyService.run(company.companyIdentifier);

            await this.seedRunnerService.seed(company.companyIdentifier)

            const uuid = this.generateUuidService.generate();

            await this.addFirstUserAsAdminService.add(company.companyIdentifier, {
                uuid,
                name: company.partnerName,
                email: company.email,
                phone: company.phone
            });
    
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