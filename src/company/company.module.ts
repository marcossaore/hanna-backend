import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { AdminCompaniesValidator } from 'src/company/admin/admin-companies.validator';
import { AdminCompanyService } from './admin-company.service';
import { CompanyService } from './company.service';
import { GenerateUuidService } from '../_common/services/Uuid/generate-uuid-service';
import { CreateDatabaseForCompanyService } from '../_common/services/Database/create-database-for-company-service';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompanyController],
  providers: [AdminCompaniesValidator, AdminCompanyService, CompanyService, GenerateUuidService, CreateDatabaseForCompanyService ],
})
export class CompanyModule {}
