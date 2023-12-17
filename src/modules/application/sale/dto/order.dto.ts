import { IsInt, IsNotEmpty } from 'class-validator'

export class OrderDto {
  @IsInt({
    message: JSON.stringify({
      message: 'O id do produto deve ser "int"!',
      field: 'productId'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O id do produto deve ser informado!',
      field: 'productId'
    })
  })
  productId: number

  @IsInt({
    message: JSON.stringify({
      message: 'A quantidade deve ser "string"!',
      field: 'quantity'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O quantidade deve ser informada!',
      field: 'quantity'
    })
  })
  quantity: number
}
