import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'
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
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O preço do produto deve ser informado!',
      field: 'price'
    })
  })
  readonly price: number

  @IsInt({
    message: JSON.stringify({
      message: 'O preço a granel do produto deve ser "number"!',
      field: 'bulkPrice'
    })
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'O preço a granel do produto deve ser informado!',
      field: 'bulkPrice'
    })
  })
  @IsOptional()
  readonly bulkPrice: number

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
