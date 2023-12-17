import 'reflect-metadata'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateProductDto } from '@/modules/application/product/dto/create-product.dto'
import { mockCreateProductDto } from '../../../../../../unit/mock/product.mock'

describe('Dto:  CreateProduct', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return all errors when data is not provided', async () => {
    const validation = plainToInstance(CreateProductDto, {})
    const errors = await validate(validation)
    expect(errors[0].constraints.isNotEmpty).toEqual(
      '{"message":"O nome do produto deve ser informado!","field":"name"}'
    )
    expect(errors[0].constraints.isString).toEqual(
      '{"message":"O nome do produto deve ser \\"string\\"!","field":"name"}'
    )
    expect(errors[1].constraints.isNotEmpty).toEqual(
      '{"message":"O preço do produto deve ser informado!","field":"price"}'
    )
    expect(errors[1].constraints.isNotEmpty).toEqual(
      '{"message":"O preço do produto deve ser informado!","field":"price"}'
    )
    expect(errors.length).toEqual(2)
  })

  it('should return error when description is provided but it is invalid', async () => {
    const validation = plainToInstance(
      CreateProductDto,
      mockCreateProductDto({ description: 1 })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.isString).toEqual(
      '{"message":"A descrição do produto deve ser \\"string\\"!","field":"description"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return error when bulkPrice is provided but it is invalid', async () => {
    const validation = plainToInstance(
      CreateProductDto,
      mockCreateProductDto({ bulkPrice: 'invalid' })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.isInt).toEqual(
      '{"message":"O preço a granel do produto deve ser \\"number\\"!","field":"bulkPrice"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return error when code is provided but it is invalid', async () => {
    const validation = plainToInstance(
      CreateProductDto,
      mockCreateProductDto({ code: 1 })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.isString).toEqual(
      '{"message":"O código de barras do produto deve ser \\"string\\"!","field":"code"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should not return when succeds without optional params', async () => {
    const validation = plainToInstance(CreateProductDto, mockCreateProductDto())
    const errors = await validate(validation)
    expect(errors.length).toEqual(0)
  })

  it('should not return when succeds with optional params', async () => {
    const validation = plainToInstance(
      CreateProductDto,
      mockCreateProductDto({
        bulkPrice: 1,
        code: 'any_code',
        description: 'any_description'
      })
    )
    const errors = await validate(validation)
    expect(errors.length).toEqual(0)
  })
})
