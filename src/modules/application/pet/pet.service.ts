import { Inject, Injectable } from '@nestjs/common'
import { Connection, Like, Repository } from 'typeorm'
import { now } from '@/adapters/helpers/date'
import { Pet } from '@infra/db/companies/entities/pet/pet.entity'
import { PetCarries } from '@/shared/enums/pet-carries.enum'
import { SavePetDto } from './dto/entity/save-pet.dto'
import { UpdatePetDto } from './dto/update-pet.dto'

@Injectable()
export class PetService {
  private readonly petRepository: Repository<Pet>

  constructor(@Inject('CONNECTION') private readonly connection: Connection) {
    this.petRepository = this.connection.getRepository(Pet)
  }

  async isRegisterd(customerId: string, petName: string): Promise<boolean> {
    const pet = await this.petRepository.findOne({
      where: {
        customer: {
          id: customerId
        },
        name: petName
      }
    })
    return pet ? true : false
  }

  async create(createPetDto: SavePetDto): Promise<Pet> {
    return this.petRepository.save({
      ...createPetDto,
      customer: {
        id: createPetDto.tutorId
      },
      carry: createPetDto.carry as PetCarries
    })
  }

  async find({
    limit,
    page,
    name,
    carry,
    breed,
    tutorId,
    tutorName
  }: {
    limit: number
    page: number
    name?: string
    carry?: string
    breed?: string
    tutorId?: string,
    tutorName?: string,
  }): Promise<[Pet[], number]> {
    const skip = (page - 1) * limit
    const where = {}

    if (name) {
      where['name'] = Like(`%${name}%`)
    }

    if (carry) {
      where['carry'] = carry
    }

    if (breed) {
      where['breed'] = breed
    }

    if (tutorId) {
      where['customer'] = {
        id: tutorId
      }
    }

    if (tutorName) {
      where['customer'] = {
        name: Like(`%${tutorName}%`)
      }
    }

    return this.petRepository.findAndCount({
      take: limit,
      skip,
      order: {
        createdAt: 'DESC'
      },
      relations: ['customer'],
      where,
      select: {
        customer: {
          id: true,
          name: true,
          phone: true,
          email: true
        }
      }
    })
  }

  async findById(id: string, tutorId: string): Promise<Pet> {
    return this.petRepository.findOne(
      {
        where: {
          id,
          customer: {
             id: tutorId
          },
        }, 
        relations: ['customer'],
        select: {
          customer: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        }
      }
    )
  }

  async save(id: string, tutorId: string, updatePetDto: UpdatePetDto) {
    return this.petRepository.save({
      ...updatePetDto,
      id,
      customer: {
        id: tutorId
      },
      carry: updatePetDto.carry as PetCarries
    })
  }

  async remove(id: string, tutorId: string) {
    const pet = await this.petRepository.findOneBy({ id, customer: { id: tutorId } })
    pet.deletedAt = now()
    return this.petRepository.save(pet)
  }
}
