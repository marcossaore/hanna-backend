import {
    Controller,
    Post,
    Body,
    ConflictException,
    UseInterceptors,
    ClassSerializerInterceptor,
    HttpCode
} from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { configAppPrefix } from '@/app/application.prefixes';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { CreatedTenantDto } from './dto/created-tenant.dto';
import { InfoMessageInterceptor } from '@/_common/interceptors/info-message-interceptor';
import { GenerateUuidService } from '@/_common/services/Uuid/generate-uuid-service';
import { TenantService } from './tenant.service';

@Controller(`${configAppPrefix}/companies`)
export class TenantController {
  constructor(
      private readonly tenantService: TenantService,
      private readonly generateUuidService: GenerateUuidService,
      @InjectQueue('create-company') private readonly createCompanyQueue: Queue
  ) {}

  @UseInterceptors(new InfoMessageInterceptor('Em breve você receberá um email com instruções de login!'), ClassSerializerInterceptor)
  @Post()
  @HttpCode(202)
  async create(@Body() createCompanyDto: CreateTenantDto): Promise<CreatedTenantDto> {
    const companyAlreadyExists = await this.tenantService.exists(createCompanyDto.document);
    if (companyAlreadyExists) {
        throw new ConflictException('A empresa já está cadastrada!');
    }
    const companyIdentifierAlreadyExists = await this.tenantService.existsIdentifier(createCompanyDto.companyIdentifier);
    if (companyIdentifierAlreadyExists) {
        throw new ConflictException('A identificação já está cadastrada!');
    }

    const uuid = this.generateUuidService.generate();

    const newCompany = await this.tenantService.create({
        ...createCompanyDto,
        uuid
    });

    try {
        this.createCompanyQueue.add({ uuid });
    } catch (error) {}
    
    return new CreatedTenantDto(newCompany);
  }
}
