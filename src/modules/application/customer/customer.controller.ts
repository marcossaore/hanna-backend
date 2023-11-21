import { appPrefix } from '@/modules/application/app/application.prefixes';
import { Controller, Post, Body, ConflictException, Get, Query, Param, NotFoundException, Patch, Delete, UseGuards } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Permissions } from '../auth/permissions/permission.decorator';
import { GenerateUuidService } from '@infra/plugins/uuid/generate-uuid-service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { PermissionsGuard } from '../auth/permissions/permission.guard';
import { CustomerService } from './customer.service';

@Controller(`${appPrefix}/customers`)
export class CustomerController {
  constructor(
    private readonly generateUuidService: GenerateUuidService,
    private readonly customerService: CustomerService
) {}

  @Post()
  @Permissions('customers', 'create')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    let existsCustomer = await this.customerService.findByPhone(createCustomerDto.phone);
    if (existsCustomer) {
        throw new ConflictException('O cliente já está cadastrado!');
    }

    if (createCustomerDto.email) {
        existsCustomer = await this.customerService.findByEmail(createCustomerDto.email);
        if (existsCustomer) {
            throw new ConflictException('O cliente já está cadastrado!');
        }
    }

    const uuid = this.generateUuidService.generate();
    const { address, ...data } = createCustomerDto;
    return this.customerService.create({
        ...data,
        ...address,
        uuid
    });
  }

  @Get()
  @Permissions('customers', 'read')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async findAll(@Query('limit') limit: number = 10, @Query('page') page: number = 1) {
    return this.customerService.findAll({
        limit,
        page
    });
  }

  @Get(':id')
  @Permissions('customers', 'read')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async findByUuid(@Param('id') id: string) {
    const customer = await this.customerService.findByUuid(id);
    if (!customer) {
        throw new NotFoundException('Cliente não encontrado!');
    }
    return customer;
  }

  @Patch(':id')
  @Permissions('customers', 'edit')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async updateByUuid(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerService.findByUuid(id);
    if (!customer) {
        throw new NotFoundException('Cliente não encontrado!');
    }
    const {address, ...data} = updateCustomerDto;
    
    let joinData = {
        ...data
    };

    if (address) {
        joinData = {
            ...joinData,
            ...address
        } 
    }
    return this.customerService.save(Object.assign(customer, joinData));
  }

  @Delete(':id')
  @Permissions('customers', 'delete')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async removeByUuid(@Param('id') id: string) {
    const customer = await this.customerService.findByUuid(id);
    if (!customer) {
        throw new NotFoundException('Cliente não encontrado!');
    }
    return this.customerService.removeByUuid(id);
  }
}
