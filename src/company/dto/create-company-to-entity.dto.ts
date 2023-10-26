import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';

export class CreateCompanyToEntity extends PartialType(CreateCompanyDto) {
    readonly uuid: string;
}
