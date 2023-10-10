import { Provider } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { EmailService } from "../../_common/services/Email/email.service"
import { CreateDatabaseService } from "../../_common/services/Database/create-database.service"
import { GenerateDbCredentialsService } from "../../_common/services/Database/generate-db-credentials.service"
import { CompanyService } from "../../company/company.service"
import { MySqlDbManagerService } from "../../../src/_common/services/Database/repository/mysql-db-manager"
import { SecretsService } from "../../../src/_common/services/Secret/secrets-service"
import { CreateCompanyProcessor } from "./create-company.processor"
import { SecretsManagerCloud } from "src/_common/services/Cloud/secrets-manager.cloud"

export const getCreateCompanyServicesProviders = (): Provider[] => {
    return [
        EmailService,
        GenerateDbCredentialsService,
        CreateDatabaseService,
        {
            provide: SecretsService,
            inject: [ConfigService],
            useFactory: ((configService: ConfigService) => {
                const awsConfig = configService.get('aws');
                const secretsManagerCloud = new SecretsManagerCloud({
                    ...awsConfig
                });
                return new SecretsService(secretsManagerCloud)
            })
        },
        MySqlDbManagerService,
        CompanyService,
        CreateCompanyProcessor
    ]
}