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
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data'

export class CreateCustomerDto {
  @IsString({
    message: JSON.stringify({
      message: 'Nome inválido!',
      field: 'name',
      fieldAccepts: "string"
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O nome deve ser informado!',
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
  @IsOptional()
  readonly email: string

  @IsFile()
  @MaxFileSize(5e6, {
    message: JSON.stringify({
        message: 'A imagem deve ter o tamanho máximo de 5MB!',
        field: 'thumb'
    })
  })
  @HasMimeType(['image/jpeg', 'image/png'], {
    message: JSON.stringify({
      message: 'A imagem deve ter extensão jpg ou png!',
      field: 'thumb'
    })
  })
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
