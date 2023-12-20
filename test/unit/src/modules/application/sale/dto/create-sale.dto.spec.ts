import 'reflect-metadata'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateSaleDto } from '@/modules/application/sale/dto/create-sale.dto'
import { mockCreateSaleDto } from '../../../../../../unit/mock/sale.mock'
import { PaymentMethodStatus } from '@/shared/enums/payment-method-status.enum'

describe('Dto:  CreateSaleDto', () => {
  let ramdomPaymentMethod: string
  let data: any

  beforeEach(() => {
    const allowedMethods = Object.keys(PaymentMethodStatus)
    const randomIndex = Math.floor(Math.random() * allowedMethods.length)
    ramdomPaymentMethod = allowedMethods[randomIndex].toLocaleLowerCase()

    data = mockCreateSaleDto({
      paymentMethod: ramdomPaymentMethod,
      orders: [
        {
          productId: randomIndex,
          quantity: randomIndex * 2
        }
      ]
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return all errors when data is not provided', async () => {
    const validation = plainToInstance(CreateSaleDto, {})
    const errors = await validate(validation)
    expect(errors[0].constraints.isEnum).toEqual(
      '{"message":"O método de pagamento deve ser um dos seguintes: Dinheiro, Crédito, Débito, Boleto, Pix ou Conta!","field":"paymentMethod: (money, credit, debit, ticket, pix, bill)"}'
    )
    expect(errors[1].constraints.arrayMinSize).toEqual(
      '{"message":"A lista de compras deve conter ao menos uma compra!","field":"orders"}'
    )
    expect(errors[1].constraints.isArray).toEqual(
      '{"message":"A lista de compras deve ser \\"array\\"!","field":"orders"}'
    )
    expect(errors[1].constraints.isNotEmpty).toEqual(
      '{"message":"A lista de compras deve ser informada!","field":"orders"}'
    )
    expect(errors.length).toEqual(2)
  })

  it('should return error when paymentMethod is provided but it is invalid', async () => {
    const validation = plainToInstance(CreateSaleDto, {
      ...data,
      paymentMethod: 'invalid_method'
    })
    const errors = await validate(validation)
    expect(errors[0].constraints.isEnum).toEqual(
      '{"message":"O método de pagamento deve ser um dos seguintes: Dinheiro, Crédito, Débito, Boleto, Pix ou Conta!","field":"paymentMethod: (money, credit, debit, ticket, pix, bill)"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return error when orders is provided but it is invalid', async () => {
    const validation = plainToInstance(
      CreateSaleDto,
      mockCreateSaleDto({
        paymentMethod: ramdomPaymentMethod,
        orders: undefined
      })
    )
    const errors = await validate(validation)
    expect(errors[0].constraints.arrayMinSize).toEqual(
      '{"message":"A lista de compras deve conter ao menos uma compra!","field":"orders"}'
    )
    expect(errors[0].constraints.isArray).toEqual(
      '{"message":"A lista de compras deve ser \\"array\\"!","field":"orders"}'
    )
    expect(errors[0].constraints.isNotEmpty).toEqual(
      '{"message":"A lista de compras deve ser informada!","field":"orders"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return when times is invalid', async () => {
    const validation = plainToInstance(CreateSaleDto, {
      ...data,
      times: 'invalid'
    })
    const errors = await validate(validation)
    expect(errors[0].constraints.isInt).toEqual(
      '{"message":"A quantidade de parcelas deve ser \\"int\\"!","field":"times"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return when times is less than 1', async () => {
    const validation = plainToInstance(CreateSaleDto, {
      ...data,
      times: 0.2
    })
    const errors = await validate(validation)
    expect(errors[0].constraints.min).toEqual(
      '{"message":"1x é a quantidade mínima de parcelas","field":"times"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return when times is greather than 12', async () => {
    const validation = plainToInstance(CreateSaleDto, {
      ...data,
      times: 13
    })
    const errors = await validate(validation)
    expect(errors[0].constraints.max).toEqual(
      '{"message":"12x é a quantidade máxima de parcelas","field":"times"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return when fee is invalid', async () => {
    const validation = plainToInstance(CreateSaleDto, {
      ...data,
      fee: 'invalid'
    })
    const errors = await validate(validation)
    expect(errors[0].constraints.isNumber).toEqual(
      '{"message":"A taxa do juros deve ser \\"number\\"!","field":"fee"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return when fee is less than 0', async () => {
    const validation = plainToInstance(CreateSaleDto, {
      ...data,
      fee: -2
    })
    const errors = await validate(validation)
    expect(errors[0].constraints.isPositive).toEqual(
      '{"message":"A taxa do juros deve ser maior que 0","field":"fee"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return when discount is invalid', async () => {
    const validation = plainToInstance(CreateSaleDto, {
      ...data,
      discount: 'invalid'
    })
    const errors = await validate(validation)
    expect(errors[0].constraints.isNumber).toEqual(
      '{"message":"O desconto deve ser \\"number\\"!","field":"discount"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return when discount is less thant 0', async () => {
    const validation = plainToInstance(CreateSaleDto, {
      ...data,
      discount: -2
    })
    const errors = await validate(validation)
    expect(errors[0].constraints.isPositive).toEqual(
      '{"message":"O desconto deve ser maior que 0","field":"discount"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should return when customerId is invalid', async () => {
    const validation = plainToInstance(CreateSaleDto, {
      ...data,
      customerId: 1
    })
    const errors = await validate(validation)
    expect(errors[0].constraints.isString).toEqual(
      '{"message":"O id do cliente deve ser \\"string\\"!","field":"customerId"}'
    )
    expect(errors.length).toEqual(1)
  })

  it('should not return when succeds without optional fields', async () => {
    const validation = plainToInstance(CreateSaleDto, data)
    const errors = await validate(validation)
    expect(errors.length).toEqual(0)
  })

  it('should not return when succeds with optional fields', async () => {
    const validation = plainToInstance(CreateSaleDto, {
      ...data,
      times: 1,
      fee: 1,
      discount: 1
    })
    const errors = await validate(validation)
    expect(errors.length).toEqual(0)
  })
})
