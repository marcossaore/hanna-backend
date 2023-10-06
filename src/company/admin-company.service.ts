import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminCompany } from './entities/admin-company.entity';
import { AdminCompany as AdminCompanyInterface  } from './admin/admin-company';

@Injectable()
export class AdminCompanyService {

  async createBulk (companyId: string, admins: AdminCompanyInterface[]): Promise<boolean> {
    return true;
  }
}
