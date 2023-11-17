import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '@db/app/entities/company/company.entity';
import { CreateCompanyProcessorModule } from '@/_jobs/consumers/create-company.processor.module';
import { CompanyService } from './company.service';
import { GenerateUuidService } from '@/_common/services/Uuid/generate-uuid-service';
import { CompanyController } from './company.controller';


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
                password: configService.get('queue.pass'),
                username: configService.get('queue.user')
              },
            }),
        }),
        CreateCompanyProcessorModule
    ],
    controllers: [CompanyController],
    providers: [
        CompanyService, 
        GenerateUuidService
    ]
})
export class CompanyModule {}
