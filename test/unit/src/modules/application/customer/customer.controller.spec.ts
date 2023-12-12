import { Test, TestingModule } from '@nestjs/testing'
import { NestjsFormDataModule } from 'nestjs-form-data'
import {
  mockCreateCustomerWithAddressDto,
  mockCustomerEntity
} from '../../../../mock/customer.mock'
import { Customer } from '@infra/db/companies/entities/customer/customer.entity'
import { CustomerService } from '@/modules/application/customer/customer.service'
import { GenerateUuidService } from '@infra/plugins/uuid/generate-uuid-service'
import { CustomerController } from '@/modules/application/customer/customer.controller'
import { StorageService } from '@/modules/infra/storage.service'
import { CreatedCustomerDto } from '@/modules/application/customer/dto/created-customer.dto'

describe('Controller: CustomerController', () => {
  let sutCustomerController: CustomerController
  let generateUuidService: GenerateUuidService
  let customerService: CustomerService
  let storageService: StorageService
  const customerEntityMock = mockCustomerEntity()
  const sessionSpy = {
    auth: {
      tenant: {
        identifier: 'any_tenant'
      }
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsFormDataModule],
      controllers: [CustomerController],
      providers: [
        {
          provide: 'CONNECTION',
          useValue: {
            getRepository: jest.fn()
          }
        },
        {
          provide: GenerateUuidService,
          useValue: {
            generate: jest.fn().mockReturnValue('any_uuid')
          }
        },
        {
          provide: CustomerService,
          useValue: {
            findByUuid: jest.fn().mockResolvedValue(customerEntityMock),
            findAll: jest
              .fn()
              .mockResolvedValue(
                Promise.resolve([mockCustomerEntity(), mockCustomerEntity()])
              ),
            findByPhone: jest.fn().mockResolvedValue(Promise.resolve(null)),
            findByEmail: jest.fn().mockResolvedValue(Promise.resolve(null)),
            verifyByEmail: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(customerEntityMock),
            save: jest.fn().mockResolvedValue(customerEntityMock),
            removeByUuid: jest.fn().mockResolvedValue(customerEntityMock),
            count: jest.fn().mockResolvedValue(10)
          }
        },
        {
          provide: StorageService,
          useValue: {
            upload: jest.fn().mockResolvedValue('http://any_url'),
            getUrl: jest.fn().mockResolvedValue('http://any_url')
          }
        }
      ]
    }).compile()

    sutCustomerController = module.get<CustomerController>(CustomerController)
    generateUuidService = module.get<GenerateUuidService>(GenerateUuidService)
    customerService = module.get<CustomerService>(CustomerService)
    storageService = module.get<StorageService>(StorageService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should call CustomerService.findByPhone with correct value', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.create(data, sessionSpy)
      expect(customerService.findByPhone).toHaveBeenCalledWith(data.phone)
      expect(customerService.findByPhone).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.findByPhone returns a customer', async () => {
      const data = mockCreateCustomerWithAddressDto()
      jest
        .spyOn(customerService, 'findByPhone')
        .mockReturnValueOnce(Promise.resolve({} as Customer))
      const promise = sutCustomerController.create(data, sessionSpy)
      await expect(promise).rejects.toThrow(
        new Error('O cliente já está cadastrado!')
      )
    })

    it('should throws if CustomerService.findByPhone throws', async () => {
      const data = mockCreateCustomerWithAddressDto()
      jest.spyOn(customerService, 'findByPhone').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.create(data, sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should not call CustomerService.findByEmail when email is not provided', async () => {
      const data = mockCreateCustomerWithAddressDto() as any
      data.email = null
      await sutCustomerController.create(data, sessionSpy)
      expect(customerService.findByEmail).toHaveBeenCalledTimes(0)
    })

    it('should call CustomerService.findByEmail with correct value when email is provided', async () => {
      const data = mockCreateCustomerWithAddressDto({
        email: 'any_email'
      })
      await sutCustomerController.create(data, sessionSpy)
      expect(customerService.findByEmail).toHaveBeenCalledWith(data.email)
      expect(customerService.findByEmail).toHaveBeenCalledTimes(1)
    })

    it('should not call CustomerService.findByEmail when email is not provided', async () => {
      const data = mockCreateCustomerWithAddressDto() as any
      data.email = null
      await sutCustomerController.create(data, sessionSpy)
      expect(customerService.findByEmail).toHaveBeenCalledTimes(0)
    })

    it('should throws if CustomerService.findByEmail returns a customer', async () => {
      const data = mockCreateCustomerWithAddressDto({
        email: 'any_email'
      })
      jest
        .spyOn(customerService, 'findByEmail')
        .mockReturnValueOnce(Promise.resolve({} as Customer))
      const promise = sutCustomerController.create(data, sessionSpy)
      await expect(promise).rejects.toThrow(
        new Error('O cliente já está cadastrado!')
      )
    })

    it('should throws if CustomerService.findByEmail throws', async () => {
      const data = mockCreateCustomerWithAddressDto()
      jest.spyOn(customerService, 'findByEmail').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.create(data, sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call GenerateUuidService.generate', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.create(data, sessionSpy)
      expect(generateUuidService.generate).toHaveBeenCalledTimes(1)
    })

    it('should throws if GenerateUuidService.generate throws', async () => {
      const data = mockCreateCustomerWithAddressDto()
      jest.spyOn(generateUuidService, 'generate').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.create(data, sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call CustomerService.create with correct values', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.create(data, sessionSpy)
      const { address, ...allData } = data
      expect(customerService.create).toHaveBeenCalledWith({
        ...allData,
        ...address,
        uuid: 'any_uuid'
      })
      expect(customerService.create).toHaveBeenCalledTimes(1)
    })

    it('should call CustomerService.create with correct values: including email and complement', async () => {
      const data = mockCreateCustomerWithAddressDto({
        email: 'any_email',
        complement: 'any_complement'
      })
      await sutCustomerController.create(data, sessionSpy)
      const { address, ...allData } = data
      expect(customerService.create).toHaveBeenCalledWith({
        ...allData,
        ...address,
        email: 'any_email',
        uuid: 'any_uuid',
        complement: 'any_complement'
      })
      expect(customerService.create).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.create throws', async () => {
      const data = mockCreateCustomerWithAddressDto()
      jest.spyOn(customerService, 'create').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.create(data, sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call StorageService.upload with correct values if thumb is provided', async () => {
      const data = mockCreateCustomerWithAddressDto({
        thumb: { buffer: ' any_buffer' }
      })
      await sutCustomerController.create(data, sessionSpy)
      expect(storageService.upload).toHaveBeenCalledWith(
        data.thumb.buffer,
        `any_tenant/customers/${customerEntityMock.uuid}`
      )
      expect(storageService.upload).toHaveBeenCalledTimes(1)
    })

    it('should not call StorageService.upload with when thumb is not provided', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.create(data, sessionSpy)
      expect(storageService.upload).toHaveBeenCalledTimes(0)
    })

    it('should throws if StorageService.upload throws', async () => {
      const data = mockCreateCustomerWithAddressDto({
        thumb: { buffer: 'any_buufer' }
      })
      jest.spyOn(storageService, 'upload').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.create(data, sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should returns a customer when succeds', async () => {
      const data = mockCreateCustomerWithAddressDto()
      const response = await sutCustomerController.create(data, sessionSpy)
      expect(response).toEqual(
        new CreatedCustomerDto({ ...customerEntityMock, thumb: null })
      )
    })

    it('should returns a customer when succeds (thumb)', async () => {
      const data = mockCreateCustomerWithAddressDto({
        thumb: { buffer: 'any_buffer' }
      })
      const response = await sutCustomerController.create(data, sessionSpy)
      expect(response).toEqual(
        new CreatedCustomerDto({
          ...customerEntityMock,
          thumb: 'http://any_url'
        })
      )
    })
  })

  describe('findAll', () => {
    it('should call CustomerService.count without values when they are not provided', async () => {
      await sutCustomerController.findAll(sessionSpy)
      expect(customerService.count).toHaveBeenCalledWith({
        email: '',
        name: '',
        phone: ''
      })
      expect(customerService.count).toHaveBeenCalledTimes(1)
    })

    it('should call CustomerService.count with values when they are provided', async () => {
      await sutCustomerController.findAll(
        sessionSpy,
        10,
        1,
        'any_name',
        'any_phone',
        'any_email'
      )
      expect(customerService.count).toHaveBeenCalledWith({
        email: 'any_email',
        name: 'any_name',
        phone: 'any_phone'
      })
      expect(customerService.count).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.count throws', async () => {
      jest.spyOn(customerService, 'count').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.findAll(sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call CustomerService.findAll with default values', async () => {
      await sutCustomerController.findAll(sessionSpy)
      expect(customerService.findAll).toHaveBeenCalledWith({
        email: '',
        name: '',
        phone: '',
        limit: 10,
        page: 1
      })
      expect(customerService.findAll).toHaveBeenCalledTimes(1)
    })

    it('should call CustomerService.findAll with limit and page provided', async () => {
      await sutCustomerController.findAll(sessionSpy, 20, 2)
      expect(customerService.findAll).toHaveBeenCalledWith({
        email: '',
        name: '',
        phone: '',
        limit: 20,
        page: 2
      })
      expect(customerService.findAll).toHaveBeenCalledTimes(1)
    })

    it('should call CustomerService.findAll with all values provided', async () => {
      await sutCustomerController.findAll(
        sessionSpy,
        10,
        1,
        'any_name',
        'any_phone',
        'any_email'
      )
      expect(customerService.findAll).toHaveBeenCalledWith({
        email: 'any_email',
        name: 'any_name',
        phone: 'any_phone',
        limit: 10,
        page: 1
      })
      expect(customerService.findAll).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.findAll throws', async () => {
      jest.spyOn(customerService, 'findAll').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.findAll(sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call StorageService.getUrl with correct values', async () => {
      await sutCustomerController.findAll(sessionSpy)
      expect(storageService.getUrl).toHaveBeenCalledTimes(2)
    })

    it('should return customers when succeds', async () => {
      const response = await sutCustomerController.findAll(sessionSpy)
      expect(response.page).toEqual(1)
      expect(response.totalPage).toEqual(1)
      expect(response.items.length).toEqual(2)
      expect(response.items[0]).toBeInstanceOf(CreatedCustomerDto)
      expect(response.items[1]).toBeInstanceOf(CreatedCustomerDto)
    })

    it('should return customers with totalPage equals max of limit', async () => {
      //example: when count has value equal 28 or 30 must return 3, if count has value 41 must return 4
      jest.spyOn(customerService, 'count').mockResolvedValueOnce(28)
      const response = await sutCustomerController.findAll(sessionSpy)
      expect(response.page).toEqual(1)
      expect(response.totalPage).toEqual(3)
      expect(response.items.length).toEqual(2)
    })
  })

  describe('findByUuid', () => {
    it('should call CustomerService.findByUuid with correct value', async () => {
      await sutCustomerController.findByUuid('any_uuid', sessionSpy)
      expect(customerService.findByUuid).toHaveBeenCalledWith('any_uuid')
      expect(customerService.findByUuid).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.findByUuid returns null', async () => {
      jest
        .spyOn(customerService, 'findByUuid')
        .mockResolvedValueOnce(Promise.resolve(null))
      const promise = sutCustomerController.findByUuid('any_uuid', sessionSpy)
      await expect(promise).rejects.toThrow(
        new Error('Cliente não encontrado!')
      )
    })

    it('should throws if CustomerService.findByUuid throws', async () => {
      jest.spyOn(customerService, 'findByUuid').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.findByUuid('any_uuid', sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call StorageService.getUrl with correct values if thumb is provided', async () => {
      await sutCustomerController.findByUuid('any_uuid', sessionSpy)
      expect(storageService.getUrl).toHaveBeenCalledWith(
        `any_tenant/customers/${customerEntityMock.uuid}`
      )
      expect(storageService.getUrl).toHaveBeenCalledTimes(1)
    })

    it('should throws if StorageService.getUrl throws', async () => {
      jest.spyOn(storageService, 'getUrl').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.findByUuid('any_uuid', sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should return a customer when succeds', async () => {
      const response = await sutCustomerController.findByUuid(
        'any_uuid',
        sessionSpy
      )
      expect(response).toEqual(
        new CreatedCustomerDto({
          ...customerEntityMock,
          thumb: 'http://any_url'
        })
      )
    })
  })

  describe('updateByUuid', () => {
    it('should call CustomerService.findByUuid with correct value', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.updateByUuid('any_uuid', data, sessionSpy)
      expect(customerService.findByUuid).toHaveBeenCalledWith('any_uuid')
      expect(customerService.findByUuid).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.findByUuid returns null', async () => {
      jest
        .spyOn(customerService, 'findByUuid')
        .mockResolvedValueOnce(Promise.resolve(null))
      const data = mockCreateCustomerWithAddressDto()
      const promise = sutCustomerController.updateByUuid(
        'any_uuid',
        data,
        sessionSpy
      )
      await expect(promise).rejects.toThrow(
        new Error('Cliente não encontrado!')
      )
    })

    it('should throws if CustomerService.findByUuid throws', async () => {
      jest.spyOn(customerService, 'findByUuid').mockImplementationOnce(() => {
        throw new Error()
      })
      const data = mockCreateCustomerWithAddressDto()
      const promise = sutCustomerController.updateByUuid(
        'any_uuid',
        data,
        sessionSpy
      )
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call CustomerService.verifyByEmail with correct values if email is provided', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.updateByUuid('any_uuid', data, sessionSpy)
      expect(customerService.verifyByEmail).toHaveBeenCalledWith(
        'any_uuid',
        data.email
      )
      expect(customerService.verifyByEmail).toHaveBeenCalledTimes(1)
    })

    it('should not call CustomerService.verifyByEmail when email is not provided', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.updateByUuid(
        'any_uuid',
        {
          ...data,
          email: null
        },
        sessionSpy
      )
      expect(customerService.verifyByEmail).toHaveBeenCalledTimes(0)
    })

    it('should throws if CustomerService.verifyByEmail returns an user', async () => {
      const data = mockCreateCustomerWithAddressDto()
      jest
        .spyOn(customerService, 'verifyByEmail')
        .mockResolvedValueOnce(Promise.resolve(customerEntityMock))
      const promise = sutCustomerController.updateByUuid(
        'any_uuid',
        data,
        sessionSpy
      )
      await expect(promise).rejects.toThrow(new Error('Email já cadastrado!'))
    })

    it('should throws if CustomerService.verifyByEmail throws', async () => {
      const data = mockCreateCustomerWithAddressDto()
      jest
        .spyOn(customerService, 'verifyByEmail')
        .mockImplementationOnce(() => {
          throw new Error()
        })
      const promise = sutCustomerController.updateByUuid(
        'any_uuid',
        data,
        sessionSpy
      )
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call StorageService.upload with correct values if thumb is provided', async () => {
      const data = mockCreateCustomerWithAddressDto({
        thumb: { buffer: ' any_buffer' }
      })
      await sutCustomerController.updateByUuid('any_uuid', data, sessionSpy)
      expect(storageService.upload).toHaveBeenCalledWith(
        data.thumb.buffer,
        'any_tenant/customers/any_uuid'
      )
      expect(storageService.upload).toHaveBeenCalledTimes(1)
    })

    it('should not call StorageService.upload with when thumb is not provided', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.updateByUuid('any_uuid', data, sessionSpy)
      expect(storageService.upload).toHaveBeenCalledTimes(0)
    })

    it('should throws if StorageService.upload throws', async () => {
      const data = mockCreateCustomerWithAddressDto({
        thumb: { buffer: 'any_buufer' }
      })
      jest.spyOn(storageService, 'upload').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.updateByUuid(
        'any_uuid',
        data,
        sessionSpy
      )
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call CustomerService.save with correct values', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.updateByUuid('any_uuid', data, sessionSpy)
      expect(customerService.findByUuid).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.save throws', async () => {
      const data = mockCreateCustomerWithAddressDto()
      jest.spyOn(customerService, 'save').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.updateByUuid(
        'any_uuid',
        data,
        sessionSpy
      )
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should return a customer when succeds', async () => {
      const data = mockCreateCustomerWithAddressDto()
      const response = await sutCustomerController.updateByUuid(
        'any_uuid',
        data,
        sessionSpy
      )
      expect(response).toEqual(
        new CreatedCustomerDto({ ...customerEntityMock, thumb: null })
      )
    })

    it('should return a customer when succeds (thumb)', async () => {
      const data = mockCreateCustomerWithAddressDto({
        thumb: { buffer: 'any_buffer' }
      })
      const response = await sutCustomerController.updateByUuid(
        'any_uuid',
        data,
        sessionSpy
      )
      expect(response).toEqual(
        new CreatedCustomerDto({
          ...customerEntityMock,
          thumb: 'http://any_url'
        })
      )
    })
  })

  describe('removeByUuid', () => {
    it('should call CustomerService.findByUuid with correct value', async () => {
      await sutCustomerController.removeByUuid('any_uuid')
      expect(customerService.findByUuid).toHaveBeenCalledWith('any_uuid')
      expect(customerService.findByUuid).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.findByUuid returns null', async () => {
      jest
        .spyOn(customerService, 'findByUuid')
        .mockResolvedValueOnce(Promise.resolve(null))
      const promise = sutCustomerController.removeByUuid('any_uuid')
      await expect(promise).rejects.toThrow(
        new Error('Cliente não encontrado!')
      )
    })

    it('should throws if CustomerService.findByUuid throws', async () => {
      jest.spyOn(customerService, 'findByUuid').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.removeByUuid('any_uuid')
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call CustomerService.removeByUuid with correct values', async () => {
      await sutCustomerController.removeByUuid('any_uuid')
      expect(customerService.removeByUuid).toHaveBeenCalledWith('any_uuid')
      expect(customerService.findByUuid).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.removeByUuid throws', async () => {
      jest.spyOn(customerService, 'removeByUuid').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.removeByUuid('any_uuid')
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should return a customer when succeds', async () => {
      const response = await sutCustomerController.removeByUuid('any_uuid')
      expect(response).toEqual(customerEntityMock)
    })
  })
})
