import { Inject, Injectable } from '@nestjs/common'
import { Connection, Like, Not, Repository } from 'typeorm'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { Customer } from '@infra/db/companies/entities/customer/customer.entity'
import { CreateCustomerDto } from './dto/create-customer.dto'

@Injectable()
export class CustomerService {
  private readonly customerRepository: Repository<Customer>

  constructor(@Inject('CONNECTION') private readonly connection: Connection) {
    this.customerRepository = this.connection.getRepository(Customer)
  }

  async findByPhone(phone: string): Promise<Customer> {
    return this.customerRepository.findOneBy({ phone })
  }

  async findByEmail(email: string): Promise<Customer> {
    return this.customerRepository.findOneBy({ email })
  }

  async verifyByEmail(id: string, email: string): Promise<Customer> {
    return this.customerRepository.findOne({
      where: {
        email,
        id: Not(id)
      }
    })
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const { address, ...data } = createCustomerDto
    return this.customerRepository.save({
      ...data,
      ...address
    })
  }

  async findAll({
    limit,
    page,
    name,
    phone,
    email
  }: {
    limit: number
    page: number
    name?: string
    phone?: string
    email?: string
  }): Promise<[Customer[], number]> {
    const skip = (page - 1) * limit
    const where = {}

    if (name) {
      where['name'] = Like(`%${name}%`)
    }

    if (phone) {
      where['phone'] = Like(`%${phone}%`)
    }

    if (email) {
      where['email'] = Like(`%${email}%`)
    }

    return this.customerRepository.findAndCount({
      take: limit,
      skip,
      order: {
        createdAt: 'DESC'
      },
      where
    })
  }

  async findById(id: string): Promise<Customer> {
    return this.customerRepository.findOneBy({ id })
  }

  async save(updateCustomerDto: UpdateCustomerDto) {
    return this.customerRepository.save(updateCustomerDto)
  }

  async removeById(id: string) {
    const customer = await this.customerRepository.findOneBy({ id })
    customer.deletedAt = new Date()
    return this.customerRepository.save(customer)
  }
}
