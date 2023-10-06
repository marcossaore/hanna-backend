import { Injectable } from "@nestjs/common";
import { CompanyService } from "../../../company/company.service";
import { GenerateDbCredentialsService } from "./generate-db-credentials.service";
import { CreateDatabaseService } from "./create-database.service";
import { EmailService } from "../Email/email.service";

@Injectable()
export class CreateDatabaseForCompanyService {

    constructor(
        private readonly companyService: CompanyService,
        private readonly generateDbCredentialsService: GenerateDbCredentialsService,
        private readonly createDataBaseService: CreateDatabaseService,
        private readonly emailService: EmailService
    ) {}
    
    async create (companyUuid: string): Promise<void> {
        const company = await this.companyService.findByUuid(companyUuid);
        const credentials = this.generateDbCredentialsService.generate();
        this.createDataBaseService.create(credentials);
        this.emailService.send(
            {
                to: company.email,
                subject: 'Conta criada com sucesso!',
                template: 'company-account-create'
            }
        );
    } 
}