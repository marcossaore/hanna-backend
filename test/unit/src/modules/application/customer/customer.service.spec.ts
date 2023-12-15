import { Test, TestingModule } from '@nestjs/testing'
import { Like } from 'typeorm'
import {
  mockCustomerEntity,
  mockCreateCustomerWithAddressDto
} from '../../../../mock/customer.mock'
import { CustomerService } from '@/modules/application/customer/customer.service'

const pageOptions = { limit: 1, page: 1 }

describe('CustomerService', () => {
  let sutCustomerService: CustomerService
  let customerRepository: any
  const customerMock = mockCustomerEntity()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'CONNECTION',
          useValue: {
            getRepository: () => jest.fn()
          }
        },
        CustomerService
      ]
    }).compile()
    sutCustomerService = module.get<CustomerService>(CustomerService)
    customerRepository = (sutCustomerService as any).customerRepository = {
      findAndCount: jest
        .fn()
        .mockResolvedValue([[customerMock, customerMock], 2]),
      findOneBy: jest.fn().mockResolvedValue(customerMock),
      save: jest.fn().mockResolvedValue(customerMock)
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('findByPhone', () => {
    it('should call CustomerRepository.findOneBy with correct phone', async () => {
      await sutCustomerService.findByPhone('any_phone')
      expect(customerRepository.findOneBy).toHaveBeenCalledWith({
        phone: 'any_phone'
      })
      expect(customerRepository.findOneBy).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerRepository.findOneBy throws', async () => {
      jest
        .spyOn(customerRepository, 'findOneBy')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const promise = sutCustomerService.findByPhone('any_phone')
      await expect(promise).rejects.toThrow()
    })

    it('should return null if phone doesnt exists', async () => {
      jest
        .spyOn(customerRepository, 'findOneBy')
        .mockResolvedValueOnce(Promise.resolve(null))
      const response = await sutCustomerService.findByPhone('any_phone')
      expect(response).toEqual(null)
    })

    it('should return a customer on success', async () => {
      const response = await sutCustomerService.findByPhone('any_phone')
      expect(response).toEqual(customerMock)
    })
  })

  describe('findByEmail', () => {
    it('should call CustomerRepository.findOneBy with correct email', async () => {
      await sutCustomerService.findByEmail('any_email')
      expect(customerRepository.findOneBy).toHaveBeenCalledWith({
        email: 'any_email'
      })
      expect(customerRepository.findOneBy).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerRepository.findOneBy throws', async () => {
      jest
        .spyOn(customerRepository, 'findOneBy')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const promise = sutCustomerService.findByPhone('any_email')
      await expect(promise).rejects.toThrow()
    })

    it('should return null if email doesnt exists', async () => {
      jest
        .spyOn(customerRepository, 'findOneBy')
        .mockResolvedValueOnce(Promise.resolve(null))
      const response = await sutCustomerService.findByPhone('any_email')
      expect(response).toEqual(null)
    })

    it('should return a customer on success', async () => {
      const response = await sutCustomerService.findByEmail('any_email')
      expect(response).toEqual(customerMock)
    })
  })

  describe('create', () => {
    it('should call CustomerRepository.create with correct values', async () => {
      const data = mockCreateCustomerWithAddressDto()
      await sutCustomerService.create(data)
      const { address, ...all } = data
      expect(customerRepository.save).toHaveBeenCalledWith({
        ...all,
        ...address
      })
      expect(customerRepository.save).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerRepository.create throws', async () => {
      jest
        .spyOn(customerRepository, 'save')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const promise = sutCustomerService.create(
        mockCreateCustomerWithAddressDto()
      )
      await expect(promise).rejects.toThrow()
    })

    it('should return a customer on success', async () => {
      const response = await sutCustomerService.create(
        mockCreateCustomerWithAddressDto()
      )
      expect(response).toEqual(customerMock)
    })
  })

  describe('find', () => {
    it('should call CustomerRepository.findAndCount with default values', async () => {
      await sutCustomerService.find(pageOptions)
      expect(customerRepository.findAndCount).toHaveBeenCalledWith({
        take: pageOptions.limit,
        skip: pageOptions.page - 1,
        order: {
          createdAt: 'DESC'
        },
        where: {}
      })
      expect(customerRepository.findAndCount).toHaveBeenCalledTimes(1)
    })

    it('should call CustomerRepository.findAndCount with provided values', async () => {
      await sutCustomerService.find({
        ...pageOptions,
        name: 'any_name',
        email: 'any_email',
        phone: 'any_phone'
      })
      expect(customerRepository.findAndCount).toHaveBeenCalledWith({
        take: pageOptions.limit,
        skip: pageOptions.page - 1,
        order: {
          createdAt: 'DESC'
        },
        where: {
          name: Like('%any_name%'),
          email: Like('%any_email%'),
          phone: Like('%any_phone%')
        }
      })
      expect(customerRepository.findAndCount).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerRepository.findAndCount throws', async () => {
      jest
        .spyOn(customerRepository, 'findAndCount')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const promise = sutCustomerService.find(pageOptions)
      await expect(promise).rejects.toThrow()
    })

    it('should return array if do not have any customer', async () => {
      jest
        .spyOn(customerRepository, 'findAndCount')
        .mockResolvedValueOnce(Promise.resolve([]))
      const response = await sutCustomerService.find(pageOptions)
      expect(response).toEqual([])
    })

    it('should return customers on success', async () => {
      const response = await sutCustomerService.find(pageOptions)
      expect(response.length).toEqual(2)
    })
  })

  describe('findById', () => {
    it('should call CustomerRepository.findOneBy with correct values', async () => {
      await sutCustomerService.findById('any_id')
      expect(customerRepository.findOneBy).toHaveBeenCalledWith({
        id: 'any_id'
      })
      expect(customerRepository.findOneBy).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerRepository.findOneBy throws', async () => {
      jest
        .spyOn(customerRepository, 'findOneBy')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const promise = sutCustomerService.findById('any_id')
      await expect(promise).rejects.toThrow()
    })

    it('should return null if customer not exists', async () => {
      jest
        .spyOn(customerRepository, 'findOneBy')
        .mockResolvedValueOnce(Promise.resolve(null))
      const response = await sutCustomerService.findById('any_id')
      expect(response).toEqual(null)
    })

    it('should return a customer on success', async () => {
      const response = await sutCustomerService.findById('any_id')
      expect(response).toEqual(customerMock)
    })
  })

  describe('save', () => {
    it('should call CustomerRepository.save with correct values', async () => {
      const data = customerMock
      await sutCustomerService.save(data)
      expect(customerRepository.save).toHaveBeenCalledWith(data)
      expect(customerRepository.save).toHaveBeenCalledTimes(1)
    })
    it('should throws if CustomerRepository.save throws', async () => {
      const data = customerMock
      jest
        .spyOn(customerRepository, 'save')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const promise = sutCustomerService.save(data)
      await expect(promise).rejects.toThrow()
    })
    it('should return a customer on success', async () => {
      const data = customerMock
      const response = await sutCustomerService.save(data)
      expect(response).toEqual(customerMock)
    })
  })

  describe('remove', () => {
    it('should call CustomerRepository.findOneBy with correct values', async () => {
      await sutCustomerService.remove('any_id')
      expect(customerRepository.findOneBy).toHaveBeenCalledWith({
        id: 'any_id'
      })
      expect(customerRepository.findOneBy).toHaveBeenCalledTimes(1)
    })
    it('should throws if CustomerRepository.findOneBy throws', async () => {
      jest
        .spyOn(customerRepository, 'findOneBy')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const promise = sutCustomerService.remove('any_id')
      await expect(promise).rejects.toThrow()
    })
    it('should call CustomerRepository.save with correct deletedAt', async () => {
      const data = mockCustomerEntity()
      jest
        .spyOn(customerRepository, 'findOneBy')
        .mockResolvedValueOnce(Promise.resolve(data))
      expect(data.deletedAt).toBe(null)
      const response = await sutCustomerService.remove('any_id')
      expect(customerRepository.save).toHaveBeenCalledTimes(1)
      expect(response.deletedAt).toBeTruthy()
    })
    it('should return a customer on success', async () => {
      const response = await sutCustomerService.remove('any_id')
      expect(response).toEqual(customerMock)
    })
  })
})
