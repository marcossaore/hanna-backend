import { MemoryStoredFile } from 'nestjs-form-data'
import { PartialType } from '@nestjs/mapped-types'
import { Exclude } from 'class-transformer'
import { CreatePetDto } from '../create-pet.dto'
import { CreateCustomerDto } from '@/modules/application/customer/dto/create-customer.dto'

export class SavePetDto extends PartialType(CreatePetDto) {
  @Exclude()
  thumb?: MemoryStoredFile

  @Exclude()
  tutor?: CreateCustomerDto

  tutorId: string

  constructor(partial: Partial<CreatePetDto>) {
    super()
    Object.assign(this, partial)
  }
}