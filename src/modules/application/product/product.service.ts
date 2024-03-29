import { Inject, Injectable } from '@nestjs/common'
import { Connection, Like, Not, Repository } from 'typeorm'
import { now } from '@/adapters/helpers/date'
import { Product } from '@infra/db/companies/entities/product/product.entity'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductService {
  private readonly productRepository: Repository<Product>

  constructor(@Inject('CONNECTION') private readonly connection: Connection) {
    this.productRepository = this.connection.getRepository(Product)
  }

  create(createProductDto: CreateProductDto) {
    return this.productRepository.save(createProductDto)
  }

  async existsCode(code: string): Promise<boolean> {
    const exists = await this.productRepository.findOneBy({
      code
    })
    return exists ? true : false
  }

  async verifyByCode(id: number, code: string): Promise<Product> {
    return this.productRepository.findOne({
      where: {
        code,
        id: Not(id)
      }
    })
  }

  async find({
    limit,
    page,
    name = null,
    code = null
  }: {
    limit: number
    page: number
    name: string | null
    code: string | null
  }): Promise<[Product[], number]> {
    const skip = (page - 1) * limit
    const where = {}

    if (code) {
      where['code'] = code
    }

    if (name && !code) {
      where['name'] = Like(`%${name}%`)
    }

    return this.productRepository.findAndCount({
      take: limit,
      skip,
      order: {
        createdAt: 'DESC'
      },
      where
    })
  }

  findById(id: number) {
    return this.productRepository.findOneBy({ id })
  }

  save(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.save({
      ...updateProductDto,
      id
    })
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneBy({ id })
    product.deletedAt = now()
    return this.productRepository.save(product)
  }
}
