import { Inject, Injectable } from '@nestjs/common'
import { Connection, Like, Not, Repository } from 'typeorm'
import { CreateCustomerToEntity } from './dto/create-customer-to-entity.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { Customer } from '@infra/db/companies/entities/customer/customer.entity'

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

  async verifyByEmail(uuid: string, email: string): Promise<Customer> {
    return this.customerRepository.findOne({
      where: {
        email,
        uuid: Not(uuid)
      }
    })
  }

  async create(createCustomerDto: CreateCustomerToEntity): Promise<Customer> {
    return this.customerRepository.save(createCustomerDto)
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
  }): Promise<Customer[]> {
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

    return this.customerRepository.find({
      take: limit,
      skip,
      order: {
        createdAt: 'DESC'
      },
      where
    })
  }

  async count({
    name,
    phone,
    email
  }: {
    name?: string
    phone?: string
    email?: string
  } = {}): Promise<number> {
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

    return this.customerRepository.count({
      where
    })
  }

  async findByUuid(id: string): Promise<Customer> {
    return this.customerRepository.findOneBy({ uuid: id })
  }

  async save(updateCustomerDto: UpdateCustomerDto) {
    return this.customerRepository.save(updateCustomerDto)
  }

  async removeByUuid(id: string) {
    const customer = await this.customerRepository.findOneBy({ uuid: id })
    customer.deletedAt = new Date()
    return this.customerRepository.save(customer)
  }
}
