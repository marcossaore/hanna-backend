import { Transform, Type } from 'class-transformer'
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested
} from 'class-validator'
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data'
import { PetCarries } from '@/shared/enums/pet-carries.enum'
import { CreateCustomerDto } from '../../customer/dto/create-customer.dto'

export class CreatePetDto {
  @IsString({
    message: JSON.stringify({
      message: 'O nome do pet deve ser "string"!',
      field: 'name'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O nome do pet deve ser informado!',
      field: 'name'
    })
  })
  readonly name: string

  @IsEnum(PetCarries, {
    message: JSON.stringify({
      message:
        'O porte do pet deve ser um dos seguintes: Pequeno, Médio, Grande ou Muito Grande',
      field: 'carry: (small, medium, large, xlarge)'
    })
  })
  readonly carry: string

  @IsString({
    message: JSON.stringify({
      message: 'A raça do pet deve ser "string"!',
      field: 'breed'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'A raça do pet deve ser informada!',
      field: 'breed'
    })
  })
  readonly breed: string

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: JSON.stringify({
      message: 'A data de nascimento deve ter o formato "xxxx-xx-xx"!',
      field: 'birthday'
    })
  })
  readonly birthday: Date

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

  @IsString({
    message: JSON.stringify({
      message: 'O identificador do cliente deve ser "string"!',
      field: 'tutorId'
    })
  })
  @IsOptional()
  readonly tutorId: string

  @ValidateIf((object) => !object.tutorId)
  @ValidateNested()
  @Type(() => CreateCustomerDto)
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O Tutor deve ser informado!',
      field: 'tutor'
    })
  })
  tutor: CreateCustomerDto
}
