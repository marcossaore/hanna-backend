import { PartialType } from '@nestjs/mapped-types';
import { CreateTenantDto } from './create-tenant.dto';

export class CreateTenantToEntity extends PartialType(CreateTenantDto) {
    readonly uuid: string;
}
