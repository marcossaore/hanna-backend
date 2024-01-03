import { IsInt, IsNotEmpty } from 'class-validator'

export class OrderDto {
  @IsInt({
    message: JSON.stringify({
      message: 'Identificador do produto inválido!',
      field: 'productId',
      fieldAccepts: "int"
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O identificador do produto deve ser informado!',
      field: 'productId'
    })
  })
  productId: number

  @IsInt({
    message: JSON.stringify({
      message: 'Quantidade inválida!',
      field: 'quantity',
      fieldAccepts: "int"
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'A quantidade deve ser informada!',
      field: 'quantity'
    })
  })
  quantity: number
}
