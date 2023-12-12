import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateAddressDto {
  @IsString({
    message: JSON.stringify({
      message: 'A rua deve ser "string"!',
      field: 'street'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'A rua deve ser informada!',
      field: 'street'
    })
  })
  street: string

  @IsString({
    message: JSON.stringify({
      message: 'O número deve ser "string"!',
      field: 'number'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O número deve ser informado!',
      field: 'number'
    })
  })
  @IsOptional()
  number?: string

  @IsString({
    message: JSON.stringify({
      message: 'O complemento deve ser "string"!',
      field: 'complement'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O complemento deve ser informado!',
      field: 'complement'
    })
  })
  @IsOptional()
  complement?: string

  @IsString({
    message: JSON.stringify({
      message: 'O bairro deve ser "string"!',
      field: 'neighborhood'
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
      message: 'A cidade deve ser "string"!',
      field: 'city'
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
      message: 'O estado deve ser "string"!',
      field: 'state'
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
      message: 'O país deve ser "string"!',
      field: 'country'
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
