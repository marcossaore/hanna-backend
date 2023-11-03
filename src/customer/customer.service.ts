import { Inject, Injectable } from '@nestjs/common';
import { Customer } from '../../db/companies/entities/customer/customer.entity';
import { CreateCustomerToEntity } from './dto/create-customer-to-entity.dto';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class CustomerService {

    private readonly companyRepository: Repository<Customer>

    constructor(
        @Inject('CONNECTION') private readonly connection: Connection
    ) {
        this.companyRepository = this.connection.getRepository(Customer)
    }

    async findByPhone(phone: string): Promise<Customer> {
        return this.companyRepository.findOneBy({ phone });
    } 

    async findByEmail(email: string): Promise<Customer> {
        return this.companyRepository.findOneBy({ email });
    }

    async create(createCustomerDto: CreateCustomerToEntity): Promise<Customer> {
        return this.companyRepository.save(createCustomerDto);
    }

    async findAll({ limit, page }: { limit: number, page: number }) : Promise<Customer[]> {
        const skip = (page - 1) * limit;
        return this.companyRepository.find({
            take: limit,
            skip,
            order: {
                createdAt: 'DESC'
            }
        });
    }

    async findOne(id: string): Promise<Customer> {
        return this.companyRepository.findOneBy({ uuid: id });
    }

    // update(id: number, updateCustomerDto: UpdateCustomerDto) {
    //     return `This action updates a #${id} customer`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} customer`;
    // }
}
