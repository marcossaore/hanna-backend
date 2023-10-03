import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { CompanyService } from './company.service';
import { GenerateUuidService } from '../services/Uuid/generate-uuid-service';
import { CreateDatabaseForCompanyService } from '../services/Database/create-database-for-company-service';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompanyController],
  providers: [CompanyService, GenerateUuidService, CreateDatabaseForCompanyService ],
})
export class CompanyModule {}
