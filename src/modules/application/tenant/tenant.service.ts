import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TenantStatus } from '@/shared/enums/tenant-status.enum'
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity'
import { CreateTenantDto } from './dto/create-tenant.dto'

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>
  ) {}

  async exists(document: string): Promise<boolean> {
    const exists = await this.tenantRepository.findOneBy({ document })
    return exists ? true : false
  }

  async existsIdentifier(identifier: string): Promise<boolean> {
    const exists = await this.tenantRepository.findOneBy({
      companyIdentifier: identifier
    })
    return exists ? true : false
  }

  async create(createCompanyDto: CreateTenantDto): Promise<Tenant> {
    return this.tenantRepository.save(createCompanyDto)
  }

  async getFirstTenant(skip: number = 1): Promise<Tenant> {
    skip = (skip - 1) * 1
    const tenant = await this.tenantRepository.find({
      take: 1,
      skip
    })
    return tenant.length > 0 ? tenant[0] : null
  }

  async findById(id: string): Promise<Tenant> {
    return this.tenantRepository.findOne({ where: { id } })
  }

  async findByDocument(document: string): Promise<Tenant> {
    return this.tenantRepository.findOne({ where: { document } })
  }

  async markAsProcessed(id: string): Promise<void> {
    const company = await this.tenantRepository.findOne({
      where: { id }
    })
    company.status = TenantStatus.PROCESSED
    this.tenantRepository.save(company)
  }

  async markAsRejected(id: string, error: Error): Promise<void> {
    const company = await this.tenantRepository.findOne({
      where: { id }
    })
    company.status = TenantStatus.REJECTED
    company.error = error.stack
    this.tenantRepository.save(company)
  }
}
