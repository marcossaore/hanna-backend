import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { ConfigService } from '@nestjs/config';
import { Company } from '../../db/app/entities/company/company.entity';
import { AdminCompaniesValidator } from 'src/company/admin/admin-companies.validator';
import { CompanyService } from './company.service';
import { GenerateUuidService } from '../_common/services/Uuid/generate-uuid-service';
import { CreateCompanyProcessorModule } from 'src/_jobs/consumers/create-company.processor.module';

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
        }),
        CreateCompanyProcessorModule
    ],
    controllers: [CompanyController],
    providers: [
        AdminCompaniesValidator, 
        CompanyService, 
        GenerateUuidService
    ]
})
export class CompanyModule {}
