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

    expect(errors[2].constraints.isInt).toEqual(
      '{"message":"A quantidade em estoque do produto deve ser \\"int\\"!","field":"quantity"}'
    )
    expect(errors[2].constraints.isNotEmpty).toEqual(
      '{"message":"A quantidade em estoque do produto deve ser informada!","field":"quantity"}'
    )
    expect(errors.length).toEqual(3)
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
    expect(errors.length).toEqual(2)
  })

  it('should return error when bulkPrice is provided but it is invalid', async () => {
    const validation = plainToInstance(
      CreateProductDto,
      mockCreateProductDto({ bulkPrice: 'invalid', quantityKg: 2 })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.isInt).toEqual(
      '{"message":"O preço a granel do produto deve ser \\"int\\"!","field":"bulkPrice"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return error when bulkPrice is provided but quantityKg not', async () => {
    const validation = plainToInstance(
      CreateProductDto,
      mockCreateProductDto({ bulkPrice: 3200 })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.isInt).toEqual(
      '{"message":"A quantidade de quilos(KG) do produto  deve \\"number\\"!","field":"quantityKg"}'
    )
    expect(errors.length).toEqual(2)
  })

  it('should return error when quantityKg is provided but it is invalid', async () => {
    const validation = plainToInstance(
      CreateProductDto,
      mockCreateProductDto({ bulkPrice: 4000, quantityKg: 'invalid' })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.isInt).toEqual(
      '{"message":"A quantidade de quilos(KG) do produto  deve \\"number\\"!","field":"quantityKg"}'
    )
    expect(errors.length).toEqual(2)
  })

  it('should return error when quantityKgActual is provided but it is invalid', async () => {
    const validation = plainToInstance(
      CreateProductDto,
      mockCreateProductDto({
        bulkPrice: 4000,
        quantityKg: 12,
        quantityKgActual: 'invalid'
      })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.isNumber).toEqual(
      '{"message":"A quantidade de quilos(KG) remanescente do produto deve ser \\"number\\"!","field":"quantityKgActual"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should not return when succeds without optional params', async () => {
    const validation = plainToInstance(
      CreateProductDto,
      mockCreateProductDto({ bulkPrice: 0 })
    )
    const errors = await validate(validation)
    expect(errors.length).toEqual(0)
  })

  it('should not return when succeds with optional params', async () => {
    const validation = plainToInstance(
      CreateProductDto,
      mockCreateProductDto({
        bulkPrice: 1299,
        quantityKg: 10,
        code: 'any_code',
        description: 'any_description',
        quantityKgActual: 0
      })
    )
    const errors = await validate(validation)
    expect(errors.length).toEqual(0)
  })
})
