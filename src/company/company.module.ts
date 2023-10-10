import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { ConfigService } from '@nestjs/config';
import { Company } from './entities/company.entity';
import { AdminCompaniesValidator } from 'src/company/admin/admin-companies.validator';
import { CompanyService } from './company.service';
import { GenerateUuidService } from '../_common/services/Uuid/generate-uuid-service';
import { getCreateCompanyServicesProviders } from '../../src/_jobs/consumers/company-processor.providers';

@Module({
    imports: [
        TypeOrmModule.forFeature([Company]),
        BullModule.registerQueueAsync({
            name: 'create-company',
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
              redis: {
                host: configService.get('queue.host'),
                port: configService.get('queue.port'),
                password: configService.get('queue.pass')
              },
            }),
        })
    ],
    controllers: [CompanyController],
    providers: [
        AdminCompaniesValidator, 
        CompanyService, 
        GenerateUuidService, 
        ...getCreateCompanyServicesProviders()
    ]
})
export class CompanyModule {}
