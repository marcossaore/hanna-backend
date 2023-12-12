import { Type } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'
import { IsPhone } from '@/validations/phone.validator'
import { CreateAddressDto } from '@/modules/application/address/dto/create-address.dto'
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data'

export class CreateCustomerDto {
  @IsString({
    message: JSON.stringify({
      message: 'O nome do cliente deve ser "string"!',
      field: 'name'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O nome do cliente deve ser informado!',
      field: 'name'
    })
  })
  readonly name: string

  @IsPhone({
    message: JSON.stringify({
      message: 'O telefone do cliente deve ser informado! Ex: 31999999999',
      field: 'phone'
    })
  })
  readonly phone: string

  @IsEmail(
    {},
    {
      message: JSON.stringify({
        message: 'O email do cliente não é válido!',
        field: 'email'
      })
    }
  )
  @IsString({
    message: JSON.stringify({
      message: 'O email do cliente deve ser "string"!',
      field: 'email'
    })
  })
  @IsOptional()
  readonly email: string

  @IsFile()
  // @MaxFileSize(1e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  @IsOptional()
  readonly thumb: MemoryStoredFile

  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O endereço do cliente deve ser informado!',
      field: 'address'
    })
  })
  address: CreateAddressDto
}
