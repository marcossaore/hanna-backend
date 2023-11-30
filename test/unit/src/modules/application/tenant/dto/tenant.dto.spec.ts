import { mockCreateCompanyDto } from '../../../../../mock/company.mock'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { CreateTenantDto } from '@/modules/application/tenant/dto/create-tenant.dto'

describe('Dto:  CreateCompany', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return all erros when data is no provided', async () => {
    const validation = plainToInstance(CreateTenantDto, {})
    const errors = await validate(validation)
    expect(errors[0].constraints.isNotEmpty).toEqual(
      '{"message":"O nome da empresa deve ser informado!","field":"name"}'
    )
    expect(errors[0].constraints.isString).toEqual(
      '{"message":"O nome da empresa deve ser \\"string\\"!","field":"name"}'
    )
    expect(errors[1].constraints.isCnpj).toEqual(
      '{"message":"O CNPJ não é válido!","field":"document"}'
    )
    expect(errors[2].constraints.isNotEmpty).toEqual(
      '{"message":"O nome do sócio deve ser informado!","field":"partnerName"}'
    )
    expect(errors[2].constraints.isString).toEqual(
      '{"message":"O nome do sócio deve ser \\"string\\"!","field":"partnerName"}'
    )
    expect(errors[3].constraints.isCpf).toEqual(
      '{"message":"O CPF do sócio não é valido!","field":"partnerDocument"}'
    )
    expect(errors[4].constraints.isCompanyIdentifier).toEqual(
      '{"message":"A identificação única da empresa deve ser informada!","field":"companyIdentifier"}'
    )
    expect(errors[5].constraints.isPhone).toEqual(
      '{"message":"O telefone do sócio deve ser informado! Ex: 31999999999","field":"phone"}'
    )
    expect(errors[6].constraints.isNotEmpty).toEqual(
      '{"message":"O email do sócio deve ser informado!","field":"email"}'
    )
    expect(errors[6].constraints.isString).toEqual(
      '{"message":"O email do sócio deve ser \\"string\\"!","field":"email"}'
    )
    expect(errors[6].constraints.isEmail).toEqual(
      '{"message":"O email do sócio não é válido!","field":"email"}'
    )
    expect(errors.length).toEqual(7)
  })

  it('should return error when cpf is invalid', async () => {
    const validation = plainToInstance(
      CreateTenantDto,
      mockCreateCompanyDto({ partnerDocument: '12345678911' })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.isCpf).toEqual(
      '{"message":"O CPF do sócio não é valido!","field":"partnerDocument"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return error when companyIdentifier is less than 6', async () => {
    const validation = plainToInstance(
      CreateTenantDto,
      mockCreateCompanyDto({ companyIdentifier: 'my_id' })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.isCompanyIdentifier).toEqual(
      '{"message":"A identificação única da empresa deve ter no mínimo 6 e máximo 12 caracteres!","field":"companyIdentifier"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return error when companyIdentifier is greater than 12', async () => {
    const validation = plainToInstance(
      CreateTenantDto,
      mockCreateCompanyDto({
        companyIdentifier: 'has_more_than_12_chars'
      })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.isCompanyIdentifier).toEqual(
      '{"message":"A identificação única da empresa deve ter no mínimo 6 e máximo 12 caracteres!","field":"companyIdentifier"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return error when companyIdentifier is has spaces in it', async () => {
    const validation = plainToInstance(
      CreateTenantDto,
      mockCreateCompanyDto({ companyIdentifier: 'has espace' })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.isCompanyIdentifier).toEqual(
      '{"message":"A identificação única da empresa não deve conter espaços!","field":"companyIdentifier"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return error when cnpj is invalid', async () => {
    const validation = plainToInstance(
      CreateTenantDto,
      mockCreateCompanyDto({ document: '12345678911' })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.isCnpj).toEqual(
      '{"message":"O CNPJ não é válido!","field":"document"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return error when phone is invalid', async () => {
    const validation = plainToInstance(
      CreateTenantDto,
      mockCreateCompanyDto({ phone: '32' })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.isPhone).toEqual(
      '{"message":"O telefone do sócio deve ser informado! Ex: 31999999999","field":"phone"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return error when email is invalid', async () => {
    const validation = plainToInstance(
      CreateTenantDto,
      mockCreateCompanyDto({ email: 'invalid_email' })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.isEmail).toEqual(
      '{"message":"O email do sócio não é válido!","field":"email"}'
    )
    expect(errors.length).toEqual(1)
  })
})
