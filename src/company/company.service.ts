import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) {}

  async exists(document: string): Promise<boolean>{
    // this.companyRepository.findOneBy()
    // return this.companyRepository.save(createCompanyDto);
    return false;
  }


  create(createCompanyDto: CreateCompanyDto & {uuid: string, apiToken: string}): any{
    // return this.companyRepository.save(createCompanyDto);
  }
}
