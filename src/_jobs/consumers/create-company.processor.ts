import { Injectable } from '@nestjs/common';
import { OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CompanyService } from '../../../src/company/company.service';
import { GenerateDbCredentialsService } from '../../_common/services/Database/generate-db-credentials.service';
import { CreateDatabaseService } from '../../_common/services/Database/create-database.service';
import { SecretsService } from '../../_common/services/Secret/secrets-service';
import { MigrationsCompanyService } from '../../_common/services/Database/migrations-company.service';
import { MailService } from '../../mail/mail.service';

@Injectable()
@Processor('create-company')
export class CreateCompanyProcessor {

    constructor(
        private readonly companyService: CompanyService,
        private readonly generateDbCredentialsService: GenerateDbCredentialsService,
        private readonly createDatabaseService: CreateDatabaseService,
        private readonly secretsService: SecretsService,
        private readonly migrationsCompanyService: MigrationsCompanyService,
        private readonly mailService: MailService,
    ){}

    @Process()
    async handleJob(job: Job) {
        const company = await this.companyService.findByUuid(job.data.uuid);
        const credentials = this.generateDbCredentialsService.generate(company.name);
        await this.createDatabaseService.create({
            db: company.companyIdentifier,
            ...credentials
        });

        this.secretsService.save(
            company.companyIdentifier,    
            JSON.stringify({
                ...credentials
            })
        );

        await this.migrationsCompanyService.run(company.companyIdentifier);

        this.mailService.send({
            to: company.email,
            subject: 'Conta criada com sucesso!',
            template: 'company-account-create',
            data: {
                name: company.name,
                document: company.document,
                admins: company.admins.map(( { name, email} ) => {
                    return {
                        name,
                        email
                    }
                })
            }
        });
    }

    @OnQueueCompleted()
    onCompleted(job: Job) {
        this.companyService.markAsProcessed(job.data.uuid);
    }
  
    @OnQueueFailed()
    onFailed(job: Job, error: Error) {
        console.log('error', error)
        this.companyService.markAsRejected(job.data.uuid, error);
    }
}