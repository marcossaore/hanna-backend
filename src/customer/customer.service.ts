import { Injectable } from '@nestjs/common';
import { Customer } from '../../db/companies/entities/customer/customer.entity';
import { CreateCustomerToEntity } from './dto/create-customer-to-entity.dto';

@Injectable()
export class CustomerService {

    async findByPhone(phone: string): Promise<Customer> {
        return null;
    } 

    async create(createCustomerDto: CreateCustomerToEntity) {
        return null;
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
