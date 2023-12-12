import 'reflect-metadata'
import { mockCreateCustomerWithAddressDto } from '../../../../../mock/customer.mock'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { CreateCustomerDto } from '@/modules/application/customer/dto/create-customer.dto'

describe('Dto:  CreateCustomerDto', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return all errors when data is not provided', async () => {
    const validation = plainToInstance(CreateCustomerDto, {})
    const errors = await validate(validation)
    expect(errors[0].constraints.isNotEmpty).toEqual(
      '{"message":"O nome do cliente deve ser informado!","field":"name"}'
    )
    expect(errors[0].constraints.isString).toEqual(
      '{"message":"O nome do cliente deve ser \\"string\\"!","field":"name"}'
    )
    expect(errors[1].constraints.isPhone).toEqual(
      '{"message":"O telefone do cliente deve ser informado! Ex: 31999999999","field":"phone"}'
    )
    expect(errors[2].constraints.isNotEmpty).toEqual(
      '{"message":"O endereço do cliente deve ser informado!","field":"address"}'
    )
    expect(errors.length).toEqual(3)
  })

  it('should return error when email is provided but it is invalid', async () => {
    const validation = plainToInstance(CreateCustomerDto, {
      name: 'any_name',
      phone: '11999999999',
      email: 'invalid_email'
    })
    const errors = await validate(validation)
    expect(errors[0].constraints.isEmail).toEqual(
      '{"message":"O email do cliente não é válido!","field":"email"}'
    )
    expect(errors.length).toEqual(2)
  })

  it('should return error when address is not provided', async () => {
    const validation = plainToInstance(CreateCustomerDto, {
      name: 'any_name',
      phone: '11999999999',
      address: {}
    })
    const errors = await validate(validation)
    expect(errors[0].children[0].constraints.isNotEmpty).toEqual(
      '{"message":"A rua deve ser informada!","field":"street"}'
    )
    expect(errors[0].children[1].constraints.isNotEmpty).toEqual(
      '{"message":"O bairro deve ser informado!","field":"neighborhood"}'
    )
    expect(errors[0].children[1].constraints.isString).toEqual(
      '{"message":"O bairro deve ser \\"string\\"!","field":"neighborhood"}'
    )
    expect(errors[0].children[2].constraints.isNotEmpty).toEqual(
      '{"message":"A cidade deve ser informada!","field":"city"}'
    )
    expect(errors[0].children[2].constraints.isString).toEqual(
      '{"message":"A cidade deve ser \\"string\\"!","field":"city"}'
    )
    expect(errors[0].children[3].constraints.isNotEmpty).toEqual(
      '{"message":"O estado deve ser informado!","field":"state"}'
    )
    expect(errors[0].children[3].constraints.isString).toEqual(
      '{"message":"O estado deve ser \\"string\\"!","field":"state"}'
    )
    expect(errors[0].children[4].constraints.isNotEmpty).toEqual(
      '{"message":"O país deve ser informado!","field":"country"}'
    )
    expect(errors[0].children[4].constraints.isString).toEqual(
      '{"message":"O país deve ser \\"string\\"!","field":"country"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should not return when succeds without complement', async () => {
    const validation = plainToInstance(
      CreateCustomerDto,
      mockCreateCustomerWithAddressDto()
    )
    const errors = await validate(validation)
    expect(errors.length).toEqual(0)
  })

  it('should not return when succeds with complement', async () => {
    const validation = plainToInstance(
      CreateCustomerDto,
      mockCreateCustomerWithAddressDto({ complement: 'any_complement' })
    )
    const errors = await validate(validation)
    expect(errors.length).toEqual(0)
  })
})
