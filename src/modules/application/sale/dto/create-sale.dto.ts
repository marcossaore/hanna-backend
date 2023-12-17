import { PaymentMethodStatus } from '@/shared/enums/payment-method-status.enum'
import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested
} from 'class-validator'
import { OrderDto } from './order.dto'
export class CreateSaleDto {
  @IsEnum(PaymentMethodStatus, {
    message: JSON.stringify({
      message:
        'O método de pagamento deve ser um dos seguintes: Dinheiro, Crédito, Débito, Boleto, Pix ou Conta!',
      field: 'paymentMethod: (money, credit, debit, ticket, pix, bill)'
    })
  })
  readonly paymentMethod: string

  @ArrayMinSize(1, {
    message: JSON.stringify({
      message: 'A lista de compras deve conter ao menos uma compra!',
      field: 'orders'
    })
  })
  @IsArray({
    message: JSON.stringify({
      message: 'A lista de compras deve ser "array"!',
      field: 'orders'
    })
  })
  @ValidateNested()
  @Type(() => OrderDto)
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'A lista de compras deve ser informada!',
      field: 'orders'
    })
  })
  orders: OrderDto[]

  @IsInt({
    message: JSON.stringify({
      message: 'A quantidade de parcelas deve ser "int"!',
      field: 'times'
    })
  })
  @Min(1, {
    message: JSON.stringify({
      message: '1x é a quantidade mínima de parcelas',
      field: 'times'
    })
  })
  @Max(12, {
    message: JSON.stringify({
      message: '12x é a quantidade máxima de parcelas',
      field: 'times'
    })
  })
  @IsOptional()
  readonly times: number

  @IsInt({
    message: JSON.stringify({
      message: 'A taxa do juros deve ser "int"!',
      field: 'fee'
    })
  })
  @Min(1, {
    message: JSON.stringify({
      message: 'A taxa deve ser maior que 0',
      field: 'times'
    })
  })
  @IsOptional()
  readonly fee: number

  @IsInt({
    message: JSON.stringify({
      message: 'O desconto deve ser "int"!',
      field: 'discount'
    })
  })
  @Min(1, {
    message: JSON.stringify({
      message: 'O desconto deve ser maior que 0',
      field: 'discount'
    })
  })
  @IsOptional()
  readonly discount: number

  @IsString({
    message: JSON.stringify({
      message: 'O id do cliente deve ser "string"!',
      field: 'customerId'
    })
  })
  @IsOptional()
  readonly customerId: string
}
