import { Transform } from 'class-transformer'
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf
} from 'class-validator'
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data'
export class CreateProductDto {
  @IsString({
    message: JSON.stringify({
      message: 'O nome do produto deve ser "string"!',
      field: 'name'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O nome do produto deve ser informado!',
      field: 'name'
    })
  })
  readonly name: string

  @IsString({
    message: JSON.stringify({
      message: 'A descrição do produto deve ser "string"!',
      field: 'description'
    })
  })
  @IsOptional()
  readonly description: string

  @IsInt({
    message: JSON.stringify({
      message: 'O preço do produto deve ser "int"!',
      field: 'price'
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
      message: 'A quantidade em estoque do produto deve ser "int"!',
      field: 'quantity'
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
      message: 'O preço a granel do produto deve ser "int"!',
      field: 'bulkPrice'
    })
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O preço a granel do produto deve ser informado!',
      field: 'bulkPrice'
    })
  })
  @IsOptional()
  readonly bulkPrice: number

  @IsInt({
    message: JSON.stringify({
      message: 'A quantidade de quilos(KG) do produto  deve "number"!',
      field: 'quantityKg'
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
        message:
          'A quantidade de quilos(KG) remanescente do produto deve ser "number"!',
        field: 'quantityKgActual'
      })
    }
  )
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty({
    message: JSON.stringify({
      message:
        'A quantidade de quilos(KG) remanescente do produto deve ser informada!',
      field: 'quantityKgActual'
    })
  })
  @IsOptional()
  @ValidateIf((object) => object.bulkPrice)
  readonly quantityKgActual: number

  @IsString({
    message: JSON.stringify({
      message: 'O código de barras do produto deve ser "string"!',
      field: 'code'
    })
  })
  @IsOptional()
  readonly code: string

  @IsFile()
  // @MaxFileSize(1e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  @IsOptional()
  readonly thumb: MemoryStoredFile
}
