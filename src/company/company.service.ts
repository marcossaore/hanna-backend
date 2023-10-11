import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../db/app/entities/company/company.entity';
import { CompanyStatus } from '../_common/enums/company-status.enum';
import { CreateCompanyToEntity } from './dto/create-company-to-entity.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) {}

  async exists(document: string): Promise<boolean>{
    const exists = await this.companyRepository.findOneBy({ document });
    return exists ? true : false;
  }

  async existsIdentifier (identifier: string): Promise<boolean> {
    const exists = await this.companyRepository.findOneBy({ companyIdentifier: identifier });
    return exists ? true : false;
  }

  async create(createCompanyDto: CreateCompanyToEntity): Promise<Company> {
    return this.companyRepository.save(createCompanyDto);
  }

  async findByUuid(uuid: string): Promise<Company> {
    return this.companyRepository.findOne({ where: { uuid }, relations: ['admins'] });
  }

  async markAsProcessed(uuid: string): Promise<void> {
    const company = await this.companyRepository.findOne({ where: { uuid }});
    company.status = CompanyStatus.PROCESSED;
    this.companyRepository.save(company);
  }

  async markAsRejected(uuid: string, error: Error): Promise<void> {
    const company = await this.companyRepository.findOne({ where: { uuid }});
    company.status = CompanyStatus.REJECTED;
    company.error = error.stack;
    this.companyRepository.save(company);
  }
}
