import { PaymentMethodStatus } from '@/shared/enums/payment-method-status.enum'
import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
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
      message: 'Lista de compras inválida!',
      field: 'orders',
      fieldAccepts: "array"
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
      message: 'Quantidade de parcelas inválida!',
      field: 'times',
      fieldAccepts: "int"
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

  @IsNumber(
    {
      maxDecimalPlaces: 2
    },
    {
      message: JSON.stringify({
        message: 'Taxa de juros inválida!',
        field: 'fee',
        fieldAccepts: "number"
      })
    }
  )
  @IsPositive({
    message: JSON.stringify({
      message: 'A taxa do juros deve ser maior que 0',
      field: 'fee'
    })
  })
  @IsOptional()
  readonly fee: number

  @IsNumber(
    {
      maxDecimalPlaces: 2
    },
    {
      message: JSON.stringify({
        message: 'Desconto inválido!',
        field: 'discount',
        fieldAccepts: "number"
      })
    }
  )
  @IsPositive({
    message: JSON.stringify({
      message: 'O desconto deve ser maior que 0',
      field: 'discount'
    })
  })
  @IsOptional()
  readonly discount: number

  @IsString({
    message: JSON.stringify({
      message: 'Identificador do cliente inválido!',
      field: 'customerId',
      fieldAccepts: "number"
    })
  })
  @IsOptional()
  readonly customerId: string
}
