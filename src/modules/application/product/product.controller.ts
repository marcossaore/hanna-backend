import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  Session,
  UseGuards,
  Query,
  NotFoundException
} from '@nestjs/common'
import { FormDataRequest } from 'nestjs-form-data'
import { StorageService } from '@/modules/infra/storage.service'
import { appPrefix } from '../app/application.prefixes'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductDto } from './dto/product..dto'
import { AuthenticatedGuard } from '../auth/authenticated.guard'
import { PermissionsGuard } from '../auth/permissions/permission.guard'
import { Permissions } from '../auth/permissions/permission.decorator'
import { ProductService } from './product.service'

@Controller(`${appPrefix}/products`)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly storageService: StorageService
  ) {}

  @Post()
  @FormDataRequest()
  @Permissions('products', 'create')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async create(
    @Session() session,
    @Body() createProductDto: CreateProductDto
  ): Promise<ProductDto> {
    if (createProductDto.code) {
      const existsProductCode = await this.productService.existsCode(
        createProductDto.code
      )
      if (existsProductCode) {
        throw new ConflictException(
          'O produto com o código de barras informado já está cadastrado!'
        )
      }
    }

    const product = await this.productService.create(createProductDto)

    let thumb = null

    if (createProductDto.thumb) {
      thumb = await this.storageService.upload(
        createProductDto.thumb.buffer,
        `${session.auth.tenant.identifier}/products/${product.id}`
      )
    }

    return new ProductDto({ ...product, thumb })
  }

  @Get()
  @Permissions('products', 'read')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async list(
    @Session() session,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1
  ): Promise<{ page: number; totalPage: number; items: ProductDto[] }> {
    const [products, count] = await this.productService.find({ limit, page })

    let totalPage = 1
    if (count > limit) {
      totalPage = Math.ceil(count / limit)
    }

    const productsWithThumb: ProductDto[] = []

    for await (const product of products) {
      const thumb = await this.storageService.getUrl(
        `${session.auth.tenant.identifier}/products/${product.id}`
      )
      productsWithThumb.push(new ProductDto({ ...product, thumb }))
    }

    return {
      page: +page,
      totalPage,
      items: productsWithThumb
    }
  }

  @Get(':id')
  @Permissions('products', 'read')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async get(@Session() session, @Param('id') id: string): Promise<ProductDto> {
    const product = await this.productService.findById(+id)
    if (!product) {
      throw new NotFoundException('Produto não encontrado!')
    }
    const thumb = await this.storageService.getUrl(
      `${session.auth.tenant.identifier}/products/${product.id}`
    )
    return new ProductDto({ ...product, thumb })
  }

  @Patch(':id')
  @FormDataRequest()
  @Permissions('products', 'edit')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async update(
    @Session() session,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<ProductDto> {
    const product = await this.productService.findById(+id)
    if (!product) {
      throw new NotFoundException('Produto não encontrado!')
    }

    if (updateProductDto.code) {
      const existsProductCode = await this.productService.existsCode(
        updateProductDto.code
      )
      if (existsProductCode) {
        throw new ConflictException(
          'O produto com o código de barras informado já está cadastrado!'
        )
      }
    }

    const { ...data } = updateProductDto

    if (!data.description) {
      data.description = null
    }

    if (!data.bulkPrice) {
      data.bulkPrice = null
    }

    if (!data.code) {
      data.code = null
    }

    let thumb = null

    if (updateProductDto.thumb) {
      thumb = await this.storageService.upload(
        updateProductDto.thumb.buffer,
        `${session.auth.tenant.identifier}/products/${id}`
      )
    } else {
      thumb = await this.storageService.getUrl(
        `${session.auth.tenant.identifier}/products/${id}`
      )
    }
    const customerUpdated = await this.productService.save(+id, data)
    return new ProductDto({ ...customerUpdated, thumb })
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // colocar uma regra para não deletar produto com vendas realizadas
    const product = await this.productService.findById(+id)
    if (!product) {
      throw new NotFoundException('Produto não encontrado!')
    }
    return this.productService.remove(+id)
  }
}
