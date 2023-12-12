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
  Session
} from '@nestjs/common'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { Permissions } from '../auth/permissions/permission.decorator'
import { GenerateUuidService } from '@infra/plugins/uuid/generate-uuid-service'
import { AuthenticatedGuard } from '../auth/authenticated.guard'
import { PermissionsGuard } from '../auth/permissions/permission.guard'
import { CustomerService } from './customer.service'
import { StorageService } from '@/modules/infra/storage.service'
import { FormDataRequest } from 'nestjs-form-data'
import { CreatedCustomerDto } from './dto/created-customer.dto'

@Controller(`${appPrefix}/customers`)
export class CustomerController {
  constructor(
    private readonly generateUuidService: GenerateUuidService,
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
    @Session() session
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

    const uuid = this.generateUuidService.generate()
    const { address, ...data } = createCustomerDto
    const customerCreated = await this.customerService.create({
      ...data,
      ...address,
      uuid
    })

    let thumb = null

    if (createCustomerDto.thumb) {
      thumb = await this.storageService.upload(
        createCustomerDto.thumb.buffer,
        `${session.auth.tenant.identifier}/customers/${customerCreated.uuid}`
      )
    }

    return new CreatedCustomerDto({ ...customerCreated, thumb })
  }

  @Get()
  @Permissions('customers', 'read')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async findAll(
    @Session() session,
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
    const count = await this.customerService.count({
      email,
      name,
      phone
    })

    let totalPage = 1

    if (count > limit) {
      totalPage = Math.ceil(count / limit)
    }

    const customers = await this.customerService.findAll({
      limit,
      page,
      name,
      phone,
      email
    })

    const customerWithThumb: CreatedCustomerDto[] = []

    for await (const customer of customers) {
      const thumb = await this.storageService.getUrl(
        `${session.auth.tenant.identifier}/customers/${customer.uuid}`
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
  async findByUuid(@Param('id') id: string, @Session() session) {
    const customer = await this.customerService.findByUuid(id)
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado!')
    }
    const thumb = await this.storageService.getUrl(
      `${session.auth.tenant.identifier}/customers/${customer.uuid}`
    )
    return new CreatedCustomerDto({ ...customer, thumb })
  }

  @Patch(':id')
  @FormDataRequest()
  @Permissions('customers', 'edit')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async updateByUuid(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Session() session
  ): Promise<CreatedCustomerDto> {
    const customer = await this.customerService.findByUuid(id)
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

    const { address, ...data } = updateCustomerDto

    if (!data.email) {
      data.email = null
    }

    if (!address.complement) {
      address.complement = null
    }

    if (!address.number) {
      address.number = null
    }

    let joinData = {
      ...data,
      uuid: id
    }

    if (address) {
      joinData = {
        ...joinData,
        ...address
      }
    }

    let thumb = null

    if (updateCustomerDto.thumb) {
      thumb = await this.storageService.upload(
        updateCustomerDto.thumb.buffer,
        `${session.auth.tenant.identifier}/customers/${id}`
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
  async removeByUuid(@Param('id') id: string) {
    const customer = await this.customerService.findByUuid(id)
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado!')
    }
    return this.customerService.removeByUuid(id)
  }
}
