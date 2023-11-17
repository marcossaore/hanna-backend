import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Company } from '@db/app/entities/company/company.entity';
import { ActionServiceSeed } from '@db/companies/seeds/action.service.seed';
import { ActionModule } from '@db/companies/entities/module/action-module.entity';
import { ModuleServiceSeed } from '@db/companies/seeds/module.service.seed';
import { MailModule } from '@/mail/mail.module';
import { CompanyService } from '@/company/company.service';
import { GenerateDbCredentialsService } from '@/_common/services/Database/generate-db-credentials.service';
import { CreateDatabaseService } from '@/_common/services/Database/create-database.service';
import { MySqlDbManagerService } from '@/_common/services/Database/repository/mysql-db-manager';
import { SecretsService } from '@/_common/services/Secret/secrets-service';
import { SecretsManagerCloud } from '@/_common/services/Cloud/secrets-manager.cloud';
import { MigrationsCompanyService } from '@/_common/services/Database/migrations-company.service';
import { GenerateUuidService } from '@/_common/services/Uuid/generate-uuid-service';
import { AddFirstUserAsAdminService } from '@/_common/services/Database/add-first-user-as-admin.service';
import { MailService } from '@/mail/mail.service';
import { CreateCompanyProcessor } from './create-company.processor';


@Module({
    imports: [
        TypeOrmModule.forFeature([Company, ActionModule]),
        MailModule
    ],
    providers: [
        ConfigService,
        CompanyService,
        GenerateDbCredentialsService,
        {
            inject: [ConfigService],
            provide: CreateDatabaseService,
            useFactory (configService: ConfigService) {
                const hostDbConfig = configService.get('database');
                return new CreateDatabaseService(hostDbConfig, new MySqlDbManagerService());
            }
        },  
        {
            inject: [ConfigService],
            provide: SecretsService,
            useFactory (configService: ConfigService) {
                const { key, secret, region, version, endpoint } = configService.get('aws');
                const secretsManagerCloud = new SecretsManagerCloud({
                    key,
                    secret,
                    region,
                    version,
                    endpoint
                });
                return new SecretsService(secretsManagerCloud);
            }
        },
        {
            inject: [ConfigService],
            provide: MigrationsCompanyService,
            useFactory (configService: ConfigService) {
                const databaseOptions = configService.get('database');
                return new MigrationsCompanyService(databaseOptions);
            }
        },
        {
            inject: [ConfigService],
            provide: ActionServiceSeed,
            useFactory (configService: ConfigService) {
                const databaseOptions = configService.get('database');
                return new ActionServiceSeed(databaseOptions);
            }
        },
        {
            inject: [ConfigService],
            provide: ModuleServiceSeed,
            useFactory (configService: ConfigService) {
                const databaseOptions = configService.get('database');
                return new ModuleServiceSeed(databaseOptions);
            }
        },
        GenerateUuidService,
        {
            inject: [ConfigService],
            provide: AddFirstUserAsAdminService,
            useFactory (configService: ConfigService) {
                const databaseOptions = configService.get('database');
                return new AddFirstUserAsAdminService(databaseOptions);
            }
        },
        MailService,
        CreateCompanyProcessor
    ],
    exports: [
        CreateCompanyProcessor
    ]
})

export class CreateCompanyProcessorModule {}
