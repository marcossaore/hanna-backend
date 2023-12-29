import { Inject, Injectable } from '@nestjs/common'
import { Connection, Like, Not, Repository } from 'typeorm'
import { now } from '@/adapters/helpers/date'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { Customer } from '@infra/db/companies/entities/customer/customer.entity'
import { CreateCustomerDto } from './dto/create-customer.dto'

@Injectable()
export class CustomerService {
  private readonly customerRepository: Repository<Customer>

  constructor(@Inject('CONNECTION') private readonly connection: Connection) {
    this.customerRepository = this.connection.getRepository(Customer)
  }

  async exists(id: string): Promise<boolean> {
    const user = await this.customerRepository.findOne({
      where: {
        id
      },
      select: {
        id: true
      }
    })
    return user ? true : false
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

  async verifyByPhone (id: string, phone: string): Promise<Customer> {
    return this.customerRepository.findOne({
      where: {
        phone,
        id: Not(id),
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

  async find({
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

  async remove(id: string) {
    const customer = await this.customerRepository.findOneBy({ id })
    customer.deletedAt = now()
    return this.customerRepository.save(customer)
  }
}
