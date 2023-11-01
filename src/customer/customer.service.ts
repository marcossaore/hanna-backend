import { Injectable } from '@nestjs/common';
import { Customer } from '../../db/companies/entities/customer/customer.entity';
import { CreateCustomerToEntity } from './dto/create-customer-to-entity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {

    constructor(
        @InjectRepository(Customer)
        private readonly companyRepository: Repository<Customer>
    ) {}

    async findByPhone(phone: string): Promise<Customer> {
        return this.companyRepository.findOneBy({ phone });
    } 

    async create(createCustomerDto: CreateCustomerToEntity) {
        return this.companyRepository.save(createCustomerDto);
    }

    // findAll() {
    //     return `This action returns all customer`;
    // }

    // findOne(id: number) {
    //     return `This action returns a #${id} customer`;
    // }

    // update(id: number, updateCustomerDto: UpdateCustomerDto) {
    //     return `This action updates a #${id} customer`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} customer`;
    // }
}
