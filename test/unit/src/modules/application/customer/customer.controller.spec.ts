import { Test, TestingModule } from '@nestjs/testing'
import { NestjsFormDataModule } from 'nestjs-form-data'
import {
  mockCreateCustomerWithAddressDto,
  mockCustomerEntity
} from '../../../../mock/customer.mock'
import { Customer } from '@infra/db/companies/entities/customer/customer.entity'
import { CustomerService } from '@/modules/application/customer/customer.service'
import { CustomerController } from '@/modules/application/customer/customer.controller'
import { StorageService } from '@/modules/infra/storage.service'
import { CreatedCustomerDto } from '@/modules/application/customer/dto/created-customer.dto'

describe('Controller: CustomerController', () => {
  let sutCustomerController: CustomerController
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
          provide: CustomerService,
          useValue: {
            findById: jest.fn().mockResolvedValue(customerEntityMock),
            find: jest
              .fn()
              .mockResolvedValue(
                Promise.resolve([
                  [mockCustomerEntity(), mockCustomerEntity()],
                  2
                ])
              ),
            findByPhone: jest.fn().mockResolvedValue(Promise.resolve(null)),
            findByEmail: jest.fn().mockResolvedValue(Promise.resolve(null)),
            verifyByEmail: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(customerEntityMock),
            save: jest.fn().mockResolvedValue(customerEntityMock),
            remove: jest.fn().mockResolvedValue(customerEntityMock),
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

    it('should call CustomerService.create with correct values', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.create(data, sessionSpy)
      expect(customerService.create).toHaveBeenCalledWith(data)
      expect(customerService.create).toHaveBeenCalledTimes(1)
    })

    it('should call CustomerService.create with correct values: including email and complement', async () => {
      const data = mockCreateCustomerWithAddressDto({
        email: 'any_email',
        complement: 'any_complement'
      })
      await sutCustomerController.create(data, sessionSpy)
      expect(customerService.create).toHaveBeenCalledWith(data)
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
        `any_tenant/customers/${customerEntityMock.id}`
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

  describe('list', () => {
    it('should call CustomerService.findAll with default values', async () => {
      await sutCustomerController.list(sessionSpy)
      expect(customerService.find).toHaveBeenCalledWith({
        email: '',
        name: '',
        phone: '',
        limit: 10,
        page: 1
      })
      expect(customerService.find).toHaveBeenCalledTimes(1)
    })

    it('should call CustomerService.findAll with limit and page provided', async () => {
      await sutCustomerController.list(sessionSpy, 20, 2)
      expect(customerService.find).toHaveBeenCalledWith({
        email: '',
        name: '',
        phone: '',
        limit: 20,
        page: 2
      })
      expect(customerService.find).toHaveBeenCalledTimes(1)
    })

    it('should call CustomerService.findAll with all values provided', async () => {
      await sutCustomerController.list(
        sessionSpy,
        10,
        1,
        'any_name',
        'any_phone',
        'any_email'
      )
      expect(customerService.find).toHaveBeenCalledWith({
        email: 'any_email',
        name: 'any_name',
        phone: 'any_phone',
        limit: 10,
        page: 1
      })
      expect(customerService.find).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.find throws', async () => {
      jest.spyOn(customerService, 'find').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.list(sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call StorageService.getUrl with correct values', async () => {
      await sutCustomerController.list(sessionSpy)
      expect(storageService.getUrl).toHaveBeenCalledTimes(2)
    })

    it('should return customers when succeds', async () => {
      const response = await sutCustomerController.list(sessionSpy)
      expect(response.page).toEqual(1)
      expect(response.totalPage).toEqual(1)
      expect(response.items.length).toEqual(2)
      expect(response.items[0]).toBeInstanceOf(CreatedCustomerDto)
      expect(response.items[1]).toBeInstanceOf(CreatedCustomerDto)
    })

    it('should return customers with totalPage equals max of limit', async () => {
      //example: when count has value equal 28 or 30 must return 3, if count has value 41 must return 4
      jest
        .spyOn(customerService, 'find')
        .mockResolvedValueOnce([
          [mockCustomerEntity(), mockCustomerEntity()],
          28
        ])
      const response = await sutCustomerController.list(sessionSpy)
      expect(response.page).toEqual(1)
      expect(response.totalPage).toEqual(3)
      expect(response.items.length).toEqual(2)
    })
  })

  describe('get', () => {
    it('should call CustomerService.findById with correct value', async () => {
      await sutCustomerController.get('any_id', sessionSpy)
      expect(customerService.findById).toHaveBeenCalledWith('any_id')
      expect(customerService.findById).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.findById returns null', async () => {
      jest
        .spyOn(customerService, 'findById')
        .mockResolvedValueOnce(Promise.resolve(null))
      const promise = sutCustomerController.get('any_id', sessionSpy)
      await expect(promise).rejects.toThrow(
        new Error('Cliente não encontrado!')
      )
    })

    it('should throws if CustomerService.findById throws', async () => {
      jest.spyOn(customerService, 'findById').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.get('any_id', sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call StorageService.getUrl with correct values if thumb is provided', async () => {
      await sutCustomerController.get('any_id', sessionSpy)
      expect(storageService.getUrl).toHaveBeenCalledWith(
        `any_tenant/customers/${customerEntityMock.id}`
      )
      expect(storageService.getUrl).toHaveBeenCalledTimes(1)
    })

    it('should throws if StorageService.getUrl throws', async () => {
      jest.spyOn(storageService, 'getUrl').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.get('any_id', sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should return a customer when succeds', async () => {
      const response = await sutCustomerController.get('any_id', sessionSpy)
      expect(response).toEqual(
        new CreatedCustomerDto({
          ...customerEntityMock,
          thumb: 'http://any_url'
        })
      )
    })
  })

  describe('update', () => {
    it('should call CustomerService.findById with correct value', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.update('any_id', data, sessionSpy)
      expect(customerService.findById).toHaveBeenCalledWith('any_id')
      expect(customerService.findById).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.findById returns null', async () => {
      jest
        .spyOn(customerService, 'findById')
        .mockResolvedValueOnce(Promise.resolve(null))
      const data = mockCreateCustomerWithAddressDto()
      const promise = sutCustomerController.update('any_id', data, sessionSpy)
      await expect(promise).rejects.toThrow(
        new Error('Cliente não encontrado!')
      )
    })

    it('should throws if CustomerService.findById throws', async () => {
      jest.spyOn(customerService, 'findById').mockImplementationOnce(() => {
        throw new Error()
      })
      const data = mockCreateCustomerWithAddressDto()
      const promise = sutCustomerController.update('any_id', data, sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call CustomerService.verifyByEmail with correct values if email is provided', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.update('any_id', data, sessionSpy)
      expect(customerService.verifyByEmail).toHaveBeenCalledWith(
        'any_id',
        data.email
      )
      expect(customerService.verifyByEmail).toHaveBeenCalledTimes(1)
    })

    it('should not call CustomerService.verifyByEmail when email is not provided', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.update(
        'any_id',
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
      const promise = sutCustomerController.update('any_id', data, sessionSpy)
      await expect(promise).rejects.toThrow(new Error('Email já cadastrado!'))
    })

    it('should throws if CustomerService.verifyByEmail throws', async () => {
      const data = mockCreateCustomerWithAddressDto()
      jest
        .spyOn(customerService, 'verifyByEmail')
        .mockImplementationOnce(() => {
          throw new Error()
        })
      const promise = sutCustomerController.update('any_id', data, sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call StorageService.upload with correct values if thumb is provided', async () => {
      const data = mockCreateCustomerWithAddressDto({
        thumb: { buffer: ' any_buffer' }
      })
      await sutCustomerController.update('any_id', data, sessionSpy)
      expect(storageService.upload).toHaveBeenCalledWith(
        data.thumb.buffer,
        'any_tenant/customers/any_id'
      )
      expect(storageService.upload).toHaveBeenCalledTimes(1)
    })

    it('should not call StorageService.upload with when thumb is not provided', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.update('any_id', data, sessionSpy)
      expect(storageService.upload).toHaveBeenCalledTimes(0)
    })

    it('should throws if StorageService.upload throws', async () => {
      const data = mockCreateCustomerWithAddressDto({
        thumb: { buffer: 'any_buufer' }
      })
      jest.spyOn(storageService, 'upload').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.update('any_id', data, sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call CustomerService.save with correct values', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerController.update('any_id', data, sessionSpy)
      expect(customerService.findById).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.save throws', async () => {
      const data = mockCreateCustomerWithAddressDto()
      jest.spyOn(customerService, 'save').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.update('any_id', data, sessionSpy)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should return a customer when succeds', async () => {
      const data = mockCreateCustomerWithAddressDto()
      const response = await sutCustomerController.update(
        'any_id',
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
      const response = await sutCustomerController.update(
        'any_id',
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

  describe('remove', () => {
    it('should call CustomerService.findById with correct value', async () => {
      await sutCustomerController.remove('any_id')
      expect(customerService.findById).toHaveBeenCalledWith('any_id')
      expect(customerService.findById).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.findById returns null', async () => {
      jest
        .spyOn(customerService, 'findById')
        .mockResolvedValueOnce(Promise.resolve(null))
      const promise = sutCustomerController.remove('any_id')
      await expect(promise).rejects.toThrow(
        new Error('Cliente não encontrado!')
      )
    })

    it('should throws if CustomerService.findById throws', async () => {
      jest.spyOn(customerService, 'findById').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.remove('any_id')
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should call CustomerService.remove with correct values', async () => {
      await sutCustomerController.remove('any_id')
      expect(customerService.remove).toHaveBeenCalledWith('any_id')
      expect(customerService.findById).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.remove throws', async () => {
      jest.spyOn(customerService, 'remove').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutCustomerController.remove('any_id')
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should return a customer when succeds', async () => {
      const response = await sutCustomerController.remove('any_id')
      expect(response).toEqual(customerEntityMock)
    })
  })
})
