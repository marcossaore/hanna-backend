import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GenerateUuidService } from '../_common/services/Uuid/generate-uuid-service';
import { CustomerService } from './customer.service';

@Controller('customers')
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

//   @Get()
//   findAll() {
//     return this.customerService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.customerService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
//     return this.customerService.update(+id, updateCustomerDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.customerService.remove(+id);
//   }
}
