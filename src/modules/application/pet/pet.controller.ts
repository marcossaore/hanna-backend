import { appPrefix } from '@/modules/application/app/application.prefixes'
import {
  Controller,
  Post,
  Body,
  ConflictException,
  Get,
  Query,
  Param,
  NotFoundException,
  Patch,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common'
import { CreatePetDto } from './dto/create-pet.dto'
import { UpdatePetDto } from './dto/update-pet.dto'
import { Permissions } from '../auth/permissions/permission.decorator'
import { AuthenticatedGuard } from '../auth/authenticated.guard'
import { PermissionsGuard } from '../auth/permissions/permission.guard'
import { PetService } from './pet.service'
import { StorageService } from '@/modules/infra/storage.service'
import { FormDataRequest } from 'nestjs-form-data'
import { CustomerService } from '../customer/customer.service'
import { PetCarries } from '@/shared/enums/pet-carries.enum'
import { PetDto } from './dto/pet.dto'

@Controller(`${appPrefix}/pets`)
export class PetController {
  constructor(
    private readonly petService: PetService,
    private readonly customerService: CustomerService,
    private readonly storageService: StorageService
  ) {}

  @UseInterceptors(
    ClassSerializerInterceptor
  )
  @Post()
  @FormDataRequest()
  @Permissions('pets', 'create')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async create(
    @Body() createPetDto: CreatePetDto,
    @Req() request
  ) {

    let tutorId = createPetDto.tutorId;

    if (tutorId) {
      const petIsAlreadyRegistered = await this.petService.isRegisterd(
        createPetDto.tutorId, createPetDto.name
      )
      if (petIsAlreadyRegistered) {
        throw new ConflictException('O pet já está cadastrado!')
      }
    }else {
      const customer = createPetDto.tutor;

      let existsCustomer = await this.customerService.findByPhone(
        customer.phone
      )
  
      if (existsCustomer) {
        throw new ConflictException('O cliente já está cadastrado!')
      }
  
      if (customer.email) {
        existsCustomer = await this.customerService.findByEmail(
          customer.email
        )
        if (existsCustomer) {
          throw new ConflictException('O cliente já está cadastrado!')
        }
      }
  
      const customerCreated = await this.customerService.create(customer)

      tutorId = customerCreated.id;
      
      if (customer.thumb) {
        await this.storageService.upload(
          customer.thumb.buffer,
          `${request.locals.companyIdentifier}/customers/${customerCreated.id}`
        )
      }
    }

    const petCreated = await this.petService.create({
      tutorId,
      ...createPetDto
    })

    let thumb = null

    if (createPetDto.thumb) {
      thumb = await this.storageService.upload(
        createPetDto.thumb.buffer,
        `${request.locals.companyIdentifier}/pets/${petCreated.id}`
      )
    }

    return new PetDto(petCreated)
  }

  @Get()
  @Permissions('pets', 'read')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async list(
    @Req() request,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
    @Query('name') name: string = '',
    @Query('carry') carry: PetCarries = null,
    @Query('breed') breed: string = '',
    @Query('tutorId') tutorId: string = '',
    @Query('tutorName') tutorName: string = ''
  ): Promise<{ page: number; totalPage: number; items: PetDto[] }> {
    const [pets, count] = await this.petService.find({
      limit,
      page,
      name,
      carry,
      breed,
      tutorId,
      tutorName
    })

    let totalPage = 1

    if (count > limit) {
      totalPage = Math.ceil(count / limit)
    }

    const petWithThumb: PetDto[] = []
    
    for await (const pet of pets) {
      const thumb = await this.storageService.getUrl(
        `${request.locals.companyIdentifier}/pets/${pet.id}`
      )
      petWithThumb.push(new PetDto({ ...pet, thumb }))
    }

    return {
      page,
      totalPage,
      items: petWithThumb
    }
  }


  @Get(':id/:tutorId')
  @Permissions('pets', 'read')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async get(@Param('id') id: string, @Param('tutorId') tutorId: string, @Req() request): Promise<PetDto> {
    const pet = await this.petService.findById(id, tutorId)
    if (!pet) {
      throw new NotFoundException('Pet não encontrado!')
    }
    const thumb = await this.storageService.getUrl(
      `${request.locals.companyIdentifier}/pets/${pet.id}`
    )
    return new PetDto({ ...pet, thumb })
  }

  @Patch(':id/:tutorId')
  @FormDataRequest()
  @Permissions('pets', 'edit')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async update(
    @Param('id') id: string,
    @Param('tutorId') tutorId: string,
    @Body() updatePetDto: UpdatePetDto,
    @Req() request
  ): Promise<PetDto> {
    const pet = await this.petService.findById(id, tutorId)
    if (!pet) {
      throw new NotFoundException('Pet não encontrado!')
    }

    let thumb = null

    if (updatePetDto.thumb) {
      thumb = await this.storageService.upload(
        updatePetDto.thumb.buffer,
        `${request.locals.companyIdentifier}/pets/${id}`
      )
    }

    const petUpdated = await this.petService.save(
      pet.id,
      pet.customer.id,
      Object.assign({...pet, customerId: pet.customer.id }, updatePetDto) as UpdatePetDto
    )

    return new PetDto({ ...petUpdated, thumb })
  }

  @Delete(':id/:tutorId')
  @Permissions('pets', 'delete')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async remove(@Param('id') id: string, @Param('tutorId') tutorId: string) {
    const customer = await this.petService.findById(id, tutorId)
    if (!customer) {
      throw new NotFoundException('Pet não encontrado!')
    }
    return this.petService.remove(id, tutorId)
  }
}
