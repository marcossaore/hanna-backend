import {
  Controller,
  Post,
  Body,
  ConflictException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';
import { CompanyService } from './company.service';
import { GenerateUuidService } from '../services/Uuid/generate-uuid-service';
import { CreateDatabaseForCompanyService } from '../services/Database/create-database-for-company-service';

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly generateUuidService: GenerateUuidService,
    private readonly createDatabaseForCompanyService: CreateDatabaseForCompanyService
  ) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    const companyAlreadyExists = await this.companyService.exists(createCompanyDto.document);
    if (companyAlreadyExists) {
        throw new ConflictException('A empresa já está cadastrada!')
    }
    const uuid = this.generateUuidService.generate();
    const apiToken = this.generateUuidService.generate();
    const newCompany = await this.companyService.create({
       ...createCompanyDto,
        uuid,
        apiToken
    });
    this.createDatabaseForCompanyService.create(newCompany.uuid)
    return newCompany;
  }
}
