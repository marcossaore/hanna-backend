import { Pet } from '@infra/db/companies/entities/pet/pet.entity'
import { PartialType } from '@nestjs/mapped-types'
import { Exclude, Expose } from 'class-transformer'

export class PetDto extends PartialType(Pet) {
  @Exclude()
  customer: any

  @Expose()
  thumb: string

  constructor(partial: Partial<Pet & { thumb?: string }>) {
    super()
    Object.assign(this, partial)
  }
}
