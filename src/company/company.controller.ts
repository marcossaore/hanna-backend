import {
  Controller,
  Post,
  Body,
  ConflictException,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreatedCompanyDto } from './dto/created-company.dto';
import { InfoMessageInterceptor } from '../_common/interceptors/info-message-interceptor';
import { GenerateUuidService } from '../_common/services/Uuid/generate-uuid-service';
import { CompanyService } from './company.service';
import { configAppPrefix } from '../app/application.prefixes';

@Controller(`${configAppPrefix}/companies`)
export class CompanyController {
  constructor(
      private readonly companyService: CompanyService,
      private readonly generateUuidService: GenerateUuidService,
      @InjectQueue('create-company') private readonly createCompanyQueue: Queue
  ) {}

  @UseInterceptors(new InfoMessageInterceptor('Em breve você receberá um email com instruções de login!'), ClassSerializerInterceptor)
  @Post()
  @HttpCode(202)
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<CreatedCompanyDto> {
    const companyAlreadyExists = await this.companyService.exists(createCompanyDto.document);
    if (companyAlreadyExists) {
        throw new ConflictException('A empresa já está cadastrada!');
    }
    const companyIdentifierAlreadyExists = await this.companyService.existsIdentifier(createCompanyDto.companyIdentifier);
    if (companyIdentifierAlreadyExists) {
        throw new ConflictException('A identificação já está cadastrada!');
    }

    const uuid = this.generateUuidService.generate();

    const newCompany = await this.companyService.create({
        ...createCompanyDto,
        uuid
    });

    try {
        this.createCompanyQueue.add({ uuid });
    } catch (error) {}
    
    return new CreatedCompanyDto(newCompany);
  }
}
