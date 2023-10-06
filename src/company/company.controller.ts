import {
  Controller,
  Post,
  Body,
  ConflictException,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreatedCompanyDto } from './dto/created-company.dto';
import { AdminCompaniesValidator } from './admin/admin-companies.validator';
import { InfoMessageInterceptor } from '../_common/interceptors/info-message-interceptor';
import { GenerateUuidService } from '../_common/services/Uuid/generate-uuid-service';
import { CreateDatabaseForCompanyService } from '../_common/services/Database/create-database-for-company-service';
import { CompanyService } from './company.service';
import { AdminCompanyService } from './admin-company.service';

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly adminCompaniesValidator: AdminCompaniesValidator,
    private readonly adminCompanyService: AdminCompanyService,
    private readonly companyService: CompanyService,
    private readonly generateUuidService: GenerateUuidService,
    private readonly createDatabaseForCompanyService: CreateDatabaseForCompanyService
  ) {}

  @UseInterceptors(new InfoMessageInterceptor('Em breve você receberá um email com instruções de login!'), ClassSerializerInterceptor)
  @Post()
  @HttpCode(202)
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<CreatedCompanyDto> {
    const adminHasErrors = await this.adminCompaniesValidator.handle(createCompanyDto.admins);
    if (adminHasErrors) {
        throw adminHasErrors;
    }
    const companyAlreadyExists = await this.companyService.exists(createCompanyDto.document);
    if (companyAlreadyExists) {
        throw new ConflictException('A empresa já está cadastrada!');
    }
    const companyIdentifierAlreadyExists = await this.companyService.existsIdentifier(createCompanyDto.companyIdentifier);
    if (companyIdentifierAlreadyExists) {
        throw new ConflictException('A identificação já está cadastrada!');
    }

    const uuid = this.generateUuidService.generate();
    const apiToken = this.generateUuidService.generate();
    const newCompany = await this.companyService.create({
        ...createCompanyDto,
        uuid,
        apiToken
    });

    this.adminCompanyService.createBulk(newCompany.uuid, createCompanyDto.admins);

    this.createDatabaseForCompanyService.create(newCompany.uuid);
    return new CreatedCompanyDto(newCompany);
  }
}
