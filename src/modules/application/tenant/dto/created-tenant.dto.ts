import { PartialType } from '@nestjs/mapped-types'
import { Exclude } from 'class-transformer'
import { Tenant } from '@infra/db/app/entities/tenant/tenant.entity'

export class CreatedTenantDto extends PartialType(Tenant) {
  @Exclude()
  id: number

  constructor(partial: Partial<Tenant>) {
    super()
    Object.assign(this, partial)
  }
}
