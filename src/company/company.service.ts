import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

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


  async create(createCompanyDto: CreateCompanyDto & {uuid: string, apiToken: string}): Promise<Company> {
    return this.companyRepository.save(createCompanyDto);
  }
}
