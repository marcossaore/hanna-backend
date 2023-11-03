import { Controller, Post, Body, ConflictException, Get, Query, Param, NotFoundException, Patch } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GenerateUuidService } from '../_common/services/Uuid/generate-uuid-service';
import { CustomerService } from './customer.service';
import { appPrefix } from '../app/application.prefixes';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller(`${appPrefix}/customers`)
export class CustomerController {
  constructor(
    private readonly generateUuidService: GenerateUuidService,
    private readonly customerService: CustomerService
) {}

  @Post()
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
  async findAll(@Query('limit') limit: number = 10, @Query('page') page: number = 1) {
    return this.customerService.findAll({
        limit,
        page
    });
  }

  @Get(':id')
  async findByUuid(@Param('id') id: string) {
    const customer = await this.customerService.findByUuid(id);
    if (!customer) {
        throw new NotFoundException('Cliente não encontrado!');
    }
    return customer;
  }

  @Patch(':id')
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

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.customerService.remove(+id);
//   }
}
