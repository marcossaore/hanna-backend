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
import { CreateTenantDto } from './dto/create-tenant.dto';
import { CreatedTenantDto } from './dto/created-tenant.dto';
import { configAppPrefix } from '@/modules/application/app/application.prefixes';
import { InfoMessageInterceptor } from '@/adapters/interceptors/info-message-interceptor';
import { GenerateUuidService } from '@infra/plugins/uuid/generate-uuid-service';
import { TenantService } from './tenant.service';

@Controller(`${configAppPrefix}/tenanties`)
export class TenantController {
  constructor(
      private readonly tenantService: TenantService,
      private readonly generateUuidService: GenerateUuidService,
      @InjectQueue('create-tenant') private readonly createTenantQueue: Queue
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
        this.createTenantQueue.add({ uuid });
    } catch (error) {}
    
    return new CreatedTenantDto(newCompany);
  }
}
