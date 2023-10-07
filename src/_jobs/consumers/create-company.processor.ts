import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CompanyService } from '../../../src/company/company.service';
import { GenerateDbCredentialsService } from '../../../src/_common/services/Database/generate-db-credentials.service';
import { CreateDatabaseService } from '../../../src/_common/services/Database/create-database.service';
import { EmailService } from '../../../src/_common/services/Email/email.service';

@Processor('create-company')
export class CreateCompanyProcessor {

    constructor(
        private readonly companyService: CompanyService,
        private readonly generateDbCredentialsService: GenerateDbCredentialsService,
        private readonly createDatabaseService: CreateDatabaseService,
        private readonly emailService: EmailService
    ){}

    @Process()
    async handleJob(job: Job) {
        const company = await this.companyService.findByUuid(job.data.uuid);
        const credentials = this.generateDbCredentialsService.generate(company.name);
        await this.createDatabaseService.create({
            db: company.companyIdentifier,
            ...credentials
        });
        this.emailService.send({
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
        })
    }
}