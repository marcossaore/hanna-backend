import {
  Controller,
  Post,
  Body,
  ConflictException,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode
} from '@nestjs/common'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { configAppPrefix } from '@/modules/application/app/application.prefixes'
import { InfoMessageInterceptor } from '@/adapters/interceptors/info-message-interceptor'
import { TenantService } from './tenant.service'
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity'
import { CreateTenantDto } from './dto/create-tenant.dto'

@Controller(`${configAppPrefix}/tenanties`)
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    @InjectQueue('create-tenant') private readonly createTenantQueue: Queue
  ) {}

  @UseInterceptors(
    new InfoMessageInterceptor(
      'Em breve você receberá um email com instruções de login!'
    ),
    ClassSerializerInterceptor
  )
  @Post()
  @HttpCode(202)
  async create(@Body() createCompanyDto: CreateTenantDto): Promise<Tenant> {
    const companyAlreadyExists = await this.tenantService.exists(
      createCompanyDto.document
    )
    if (companyAlreadyExists) {
      throw new ConflictException('A empresa já está cadastrada!')
    }
    const companyIdentifierAlreadyExists =
      await this.tenantService.existsIdentifier(
        createCompanyDto.companyIdentifier
      )
    if (companyIdentifierAlreadyExists) {
      throw new ConflictException('A identificação já está cadastrada!')
    }

    const newCompany = await this.tenantService.create(createCompanyDto)

    try {
      this.createTenantQueue.add({ id: newCompany.id })
    } catch (error) {}

    return newCompany
  }
}
