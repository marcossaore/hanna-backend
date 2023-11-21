import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';

export class CreateCustomerToEntity extends PartialType(CreateCustomerDto) {
    readonly uuid: string;
}
