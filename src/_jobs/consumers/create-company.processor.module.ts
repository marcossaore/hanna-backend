import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCompanyProcessor } from './create-company.processor';
import { CompanyService } from '../../company/company.service';
import { GenerateDbCredentialsService } from '../../_common/services/Database/generate-db-credentials.service';
import { CreateDatabaseService } from '../../_common/services/Database/create-database.service';
import { SecretsService } from '../../_common/services/Secret/secrets-service';
import { SecretsManagerCloud } from '../../_common/services/Cloud/secrets-manager.cloud';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { MySqlDbManagerService } from 'src/_common/services/Database/repository/mysql-db-manager';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Company]),
        MailModule
    ],
    providers: [
        ConfigService,
        CompanyService,
        GenerateDbCredentialsService,
        MySqlDbManagerService,
        CreateDatabaseService,
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
        MailService,
        CreateCompanyProcessor
    ],
    exports: [
        CreateCompanyProcessor
    ]
})

export class CreateCompanyProcessorModule {}
