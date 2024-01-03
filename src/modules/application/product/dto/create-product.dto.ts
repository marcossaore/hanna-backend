import { Transform } from 'class-transformer'
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf
} from 'class-validator'
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data'
export class CreateProductDto {
  @IsString({
    message: JSON.stringify({
      message: 'Nome inválido!',
      field: 'name',
      fieldAccepts: "string"
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O Nome deve ser informado!',
      field: 'name'
    })
  })
  readonly name: string

  @IsString({
    message: JSON.stringify({
      message: 'Descrição inválida!',
      field: 'description',
      fieldAccepts: "string"
    })
  })
  @IsOptional()
  readonly description: string

  @IsInt({
    message: JSON.stringify({
      message: 'Preço inválido!',
      field: 'price',
      fieldAccepts: "int"
    })
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O preço do produto deve ser informado!',
      field: 'price'
    })
  })
  readonly price: number

  @IsInt({
    message: JSON.stringify({
      message: 'Quantidade em estoque inválida!',
      field: 'quantity',
      fieldAccepts: "int"
    })
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'A quantidade em estoque do produto deve ser informada!',
      field: 'quantity'
    })
  })
  readonly quantity: number

  @IsInt({
    message: JSON.stringify({
      message: 'Preço a granel inválido!',
      field: 'bulkPrice',
      fieldAccepts: "int"
    })
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  readonly bulkPrice: number

  @IsInt({
    message: JSON.stringify({
      message: 'Quantidade de quilos(KG) do produto inválida!',
      field: 'quantityKg',
      fieldAccepts: "int"
    })
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'A quantidade de quilos(KG) do produto deve ser informada!',
      field: 'quantityKg'
    })
  })
  @ValidateIf((object) => object.bulkPrice)
  readonly quantityKg: number

  @IsNumber(
    {},
    {
      message: JSON.stringify({
        message: 'Quantidade de quilos(KG) avulsos do produto inválida!',
        field: 'quantityKgActual',
        fieldAccepts: "number"
      })
    }
  )
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty({
    message: JSON.stringify({
      message:
        'A quantidade de quilos(KG) avulsos do produto deve ser informada!',
      field: 'quantityKgActual'
    })
  })
  @IsOptional()
  @ValidateIf((object) => object.bulkPrice)
  readonly quantityKgActual: number

  @IsString({
    message: JSON.stringify({
      message: 'Código de barras inválido!',
      field: 'code',
      fieldAccepts: "string"
    })
  })
  @IsOptional()
  readonly code: string

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
}
