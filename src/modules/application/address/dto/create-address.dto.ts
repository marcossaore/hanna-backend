import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateAddressDto {
  @IsString({
    message: JSON.stringify({
      message: 'Logradouro inválido!',
      field: 'street',
      fieldAccepts: "string"
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O Logradouro deve ser informada!',
      field: 'street'
    })
  })
  street: string

  @IsString({
    message: JSON.stringify({
      message: 'Número inválido!',
      field: 'number',
      fieldAccepts: "string"
    })
  })
  @IsOptional()
  number?: string

  @IsString({
    message: JSON.stringify({
      message: 'Complemento inválido!',
      field: 'complement',
      fieldAccepts: "string"
    })
  })
  @IsOptional()
  complement?: string

  @IsString({
    message: JSON.stringify({
      message: 'Bairro inválido!',
      field: 'neighborhood',
      fieldAccepts: "string"
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O bairro deve ser informado!',
      field: 'neighborhood'
    })
  })
  neighborhood: string

  @IsString({
    message: JSON.stringify({
      message: 'Cidade inválida!',
      field: 'city',
      fieldAccepts: "string"
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'A cidade deve ser informada!',
      field: 'city'
    })
  })
  city: string

  @IsString({
    message: JSON.stringify({
      message: 'Estado inválido!',
      field: 'state',
      fieldAccepts: "string"
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O estado deve ser informado!',
      field: 'state'
    })
  })
  state: string

  @IsString({
    message: JSON.stringify({
      message: 'País inválido!',
      field: 'country',
      fieldAccepts: "string"
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O país deve ser informado!',
      field: 'country'
    })
  })
  country: string
}
