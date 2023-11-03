import { Inject, Injectable } from '@nestjs/common';
import { Customer } from '../../db/companies/entities/customer/customer.entity';
import { CreateCustomerToEntity } from './dto/create-customer-to-entity.dto';
import { Connection, Repository } from 'typeorm';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {

    private readonly customerRepository: Repository<Customer>

    constructor(
        @Inject('CONNECTION') private readonly connection: Connection
    ) {
        this.customerRepository = this.connection.getRepository(Customer)
    }

    async findByPhone(phone: string): Promise<Customer> {
        return this.customerRepository.findOneBy({ phone });
    } 

    async findByEmail(email: string): Promise<Customer> {
        return this.customerRepository.findOneBy({ email });
    }

    async create(createCustomerDto: CreateCustomerToEntity): Promise<Customer> {
        return this.customerRepository.save(createCustomerDto);
    }

    async findAll({ limit, page }: { limit: number, page: number }) : Promise<Customer[]> {
        const skip = (page - 1) * limit;
        return this.customerRepository.find({
            take: limit,
            skip,
            order: {
                createdAt: 'DESC'
            }
        });
    }

    async findByUuid(id: string): Promise<Customer> {
        return this.customerRepository.findOneBy({ uuid: id });
    }

    async save(updateCustomerDto: UpdateCustomerDto) {
        return this.customerRepository.save(updateCustomerDto);
    }

    // remove(id: number) {
    //     return `This action removes a #${id} customer`;
    // }
}
