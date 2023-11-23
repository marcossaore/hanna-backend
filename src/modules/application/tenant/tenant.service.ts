import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTenantToEntity } from './dto/create-tenant-to-entity.dto';
import { TenantStatus } from '@/shared/enums/tenant-status.enum';
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly companyRepository: Repository<Tenant>
  ) {}

  async exists(document: string): Promise<boolean>{
    const exists = await this.companyRepository.findOneBy({ document });
    return exists ? true : false;
  }

  async existsIdentifier (identifier: string): Promise<boolean> {
    const exists = await this.companyRepository.findOneBy({ companyIdentifier: identifier });
    return exists ? true : false;
  }

  async create(createCompanyDto: CreateTenantToEntity): Promise<Tenant> {
    return this.companyRepository.save(createCompanyDto);
  }

  async findByUuid(uuid: string): Promise<Tenant> {
    return this.companyRepository.findOne({ where: { uuid }});
  }

  async findByDocument(document: string): Promise<Tenant> {
    return this.companyRepository.findOne({ where: { document }});
  }

  async markAsProcessed(uuid: string): Promise<void> {
    const company = await this.companyRepository.findOne({ where: { uuid }});
    company.status = TenantStatus.PROCESSED;
    this.companyRepository.save(company);
  }

  async markAsRejected(uuid: string, error: Error): Promise<void> {
    const company = await this.companyRepository.findOne({ where: { uuid }});
    company.status = TenantStatus.REJECTED;
    company.error = error.stack;
    this.companyRepository.save(company);
  }
}