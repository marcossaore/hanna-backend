import { appPrefix } from '@/modules/application/app/application.prefixes'
import {
  Controller,
  Post,
  Body,
  ConflictException,
  Get,
  Query,
  Param,
  NotFoundException,
  Patch,
  Delete,
  UseGuards,
  Req
} from '@nestjs/common'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { Permissions } from '../auth/permissions/permission.decorator'
import { AuthenticatedGuard } from '../auth/authenticated.guard'
import { PermissionsGuard } from '../auth/permissions/permission.guard'
import { CustomerService } from './customer.service'
import { StorageService } from '@/modules/infra/storage.service'
import { FormDataRequest } from 'nestjs-form-data'
import { CreatedCustomerDto } from './dto/created-customer.dto'

@Controller(`${appPrefix}/customers`)
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly storageService: StorageService
  ) {}

  @Post()
  @FormDataRequest()
  @Permissions('customers', 'create')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Req() request
  ) {
    let existsCustomer = await this.customerService.findByPhone(
      createCustomerDto.phone
    )

    if (existsCustomer) {
      throw new ConflictException('O cliente já está cadastrado!')
    }

    if (createCustomerDto.email) {
      existsCustomer = await this.customerService.findByEmail(
        createCustomerDto.email
      )
      if (existsCustomer) {
        throw new ConflictException('O cliente já está cadastrado!')
      }
    }

    const customerCreated = await this.customerService.create(createCustomerDto)

    let thumb = null

    if (createCustomerDto.thumb) {
      thumb = await this.storageService.upload(
        createCustomerDto.thumb.buffer,
        `${request.locals.companyIdentifier}/customers/${customerCreated.id}`
      )
    }

    return new CreatedCustomerDto({ ...customerCreated, thumb })
  }

  @Get()
  @Permissions('customers', 'read')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async list(
    @Req() request,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
    @Query('name') name: string = '',
    @Query('phone') phone: string = '',
    @Query('email') email: string = ''
    // @Query('activePlan') activePlan: boolean = false,
    // @Query('activeBill') activeBill: boolean = false
  ): Promise<{ page: number; totalPage: number; items: CreatedCustomerDto[] }> {
    // implementar pets, trazer os pets dos clientes
    // implementar planos e contas
    const [customers, count] = await this.customerService.find({
      limit,
      page,
      name,
      phone,
      email
    })

    let totalPage = 1

    if (count > limit) {
      totalPage = Math.ceil(count / limit)
    }

    const customerWithThumb: CreatedCustomerDto[] = []
    
    for await (const customer of customers) {
      const thumb = await this.storageService.getUrl(
        `${request.locals.companyIdentifier}/customers/${customer.id}`
      )
      customerWithThumb.push(new CreatedCustomerDto({ ...customer, thumb }))
    }

    return {
      page,
      totalPage,
      items: customerWithThumb
    }
  }

  @Get(':id')
  @Permissions('customers', 'read')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async get(@Param('id') id: string, @Req() request) {
    const customer = await this.customerService.findById(id)
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado!')
    }
    const thumb = await this.storageService.getUrl(
      `${request.locals.companyIdentifier}/customers/${customer.id}`
    )
    return new CreatedCustomerDto({ ...customer, thumb })
  }

  @Patch(':id')
  @FormDataRequest()
  @Permissions('customers', 'edit')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Req() request
  ): Promise<CreatedCustomerDto> {
    const customer = await this.customerService.findById(id)
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado!')
    }

    if (updateCustomerDto.email) {
      const existsCustomerWithSameEmail =
        await this.customerService.verifyByEmail(id, updateCustomerDto.email)
      if (existsCustomerWithSameEmail) {
        throw new NotFoundException('Email já cadastrado!')
      }
    }

    if (updateCustomerDto.phone) {
      const existsCustomerWithSamePhone = await this.customerService.verifyByPhone(id, updateCustomerDto.phone)
      if (existsCustomerWithSamePhone) {
        throw new NotFoundException('Celular já cadastrado!')
      }
    }

    const { address, ...data } = updateCustomerDto

    if (!data.email) {
      data.email = null
    }

    let joinData = {
      ...data,
      id
    }

    if (address) {
      if (!address.complement) {
        address.complement = null
      }

      if (!address.number) {
        address.number = null
      }

      joinData = {
        ...joinData,
        ...address
      }
    }

    let thumb = null

    if (updateCustomerDto.thumb) {
      thumb = await this.storageService.upload(
        updateCustomerDto.thumb.buffer,
        `${request.locals.companyIdentifier}/customers/${id}`
      )
    }

    const customerUpdated = await this.customerService.save(
      Object.assign(customer, joinData)
    )
    return new CreatedCustomerDto({ ...customerUpdated, thumb })
  }

  @Delete(':id')
  @Permissions('customers', 'delete')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async remove(@Param('id') id: string) {
    const customer = await this.customerService.findById(id)
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado!')
    }
    return this.customerService.remove(id)
  }
}
