import { Test, TestingModule } from '@nestjs/testing'
import { ProductService } from './product.service'
import {
  mockCreateProductDto,
  mockProductEntity
} from '../../../../test/unit/mock/product.mock'
import { Like, Not } from 'typeorm'
const pageOptions = { limit: 1, page: 1, name: null, code: null }

describe('Service: Product', () => {
  let sutProductService: ProductService
  let productRepository: any
  const productEntityMock = mockProductEntity()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'CONNECTION',
          useValue: {
            getRepository: () => jest.fn()
          }
        },
        ProductService
      ]
    }).compile()
    sutProductService = module.get<ProductService>(ProductService)
    productRepository = (sutProductService as any).productRepository = {
      create: jest.fn().mockResolvedValue(productEntityMock),
      findAndCount: jest
        .fn()
        .mockResolvedValue([[productEntityMock, productEntityMock], 2]),
      findOneBy: jest.fn().mockResolvedValue(productEntityMock),
      findOne: jest.fn().mockResolvedValue(productEntityMock),
      save: jest.fn().mockResolvedValue(productEntityMock),
      remove: jest.fn().mockResolvedValue(productEntityMock)
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should call ProductRepository.save with correct values', async () => {
      const data = mockCreateProductDto()
      await sutProductService.create(data)
      expect(productRepository.save).toHaveBeenCalledWith(data)
      expect(productRepository.save).toHaveBeenCalledTimes(1)
    })

    it('should throws if ProductRepository.save throws', async () => {
      const data = mockCreateProductDto()
      jest.spyOn(productRepository, 'save').mockImplementationOnce(async () => {
        throw new Error()
      })
      const promise = sutProductService.create(data)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('existsCode', () => {
    it('should call ProductRepository.findOneBy with correct email', async () => {
      await sutProductService.existsCode('any_code')
      expect(productRepository.findOneBy).toHaveBeenCalledWith({
        code: 'any_code'
      })
      expect(productRepository.findOneBy).toHaveBeenCalledTimes(1)
    })

    it('should throws if ProductRepository.findOneBy throws', async () => {
      jest
        .spyOn(productRepository, 'findOneBy')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const promise = sutProductService.existsCode('any_code')
      await expect(promise).rejects.toThrow()
    })

    it('should return true if code exists', async () => {
      const response = await sutProductService.existsCode('any_code')
      expect(response).toEqual(true)
    })

    it('should return false if code not exists', async () => {
      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValueOnce(Promise.resolve(null))
      const response = await sutProductService.existsCode('any_code')
      expect(response).toEqual(false)
    })
  })

  describe('verifyByCode', () => {
    it('should call ProductRepository.findOne with correct values', async () => {
      await sutProductService.verifyByCode(2, 'any_code')
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: {
          code: 'any_code',
          id: Not(2)
        }
      })
      expect(productRepository.findOne).toHaveBeenCalledTimes(1)
    })

    it('should throws if ProductRepository.findOne throws', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const promise = sutProductService.verifyByCode(2, 'any_code')
      await expect(promise).rejects.toThrow()
    })

    it('should return a product if code exists', async () => {
      const response = await sutProductService.verifyByCode(2, 'any_code')
      expect(response).toEqual(productEntityMock)
    })

    it('should return null if code not exists', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValueOnce(Promise.resolve(null))
      const response = await sutProductService.verifyByCode(2, 'any_code')
      expect(response).toEqual(null)
    })
  })

  describe('find', () => {
    it('should call ProductRepository.findAndCount with default values', async () => {
      await sutProductService.find(pageOptions)
      expect(productRepository.findAndCount).toHaveBeenCalledWith({
        take: pageOptions.limit,
        skip: pageOptions.page - 1,
        order: {
          createdAt: 'DESC'
        },
        where: {}
      })
      expect(productRepository.findAndCount).toHaveBeenCalledTimes(1)
    })

    it('should call ProductRepository.findAndCount with where when name is provided', async () => {
      await sutProductService.find({ ...pageOptions, name: 'any_name' })
      expect(productRepository.findAndCount).toHaveBeenCalledWith({
        take: pageOptions.limit,
        skip: pageOptions.page - 1,
        order: {
          createdAt: 'DESC'
        },
        where: {
          name: Like(`%any_name%`)
        }
      })
      expect(productRepository.findAndCount).toHaveBeenCalledTimes(1)
    })

    it('should call ProductRepository.findAndCount with where when code is provided', async () => {
      await sutProductService.find({ ...pageOptions, code: 'any_code' })
      expect(productRepository.findAndCount).toHaveBeenCalledWith({
        take: pageOptions.limit,
        skip: pageOptions.page - 1,
        order: {
          createdAt: 'DESC'
        },
        where: {
          code: 'any_code'
        }
      })
      expect(productRepository.findAndCount).toHaveBeenCalledTimes(1)
    })

    it('should call ProductRepository.findAndCount with where with only code if name and code are provided', async () => {
      await sutProductService.find({
        ...pageOptions,
        name: 'any_name',
        code: 'any_code'
      })
      expect(productRepository.findAndCount).toHaveBeenCalledWith({
        take: pageOptions.limit,
        skip: pageOptions.page - 1,
        order: {
          createdAt: 'DESC'
        },
        where: {
          code: 'any_code'
        }
      })
      expect(productRepository.findAndCount).toHaveBeenCalledTimes(1)
    })

    it('should throws if ProductRepository.findAndCount throws', async () => {
      jest
        .spyOn(productRepository, 'findAndCount')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const promise = sutProductService.find(pageOptions)
      await expect(promise).rejects.toThrow()
    })

    it('should return array if do not have any product', async () => {
      jest
        .spyOn(productRepository, 'findAndCount')
        .mockResolvedValueOnce(Promise.resolve([]))
      const response = await sutProductService.find(pageOptions)
      expect(response).toEqual([])
    })

    it('should return products on success', async () => {
      const response = await sutProductService.find(pageOptions)
      expect(response.length).toEqual(2)
    })
  })

  describe('findOneBy', () => {
    it('should call ProductRepository.findOneBy with correct values', async () => {
      await sutProductService.findById(2)
      expect(productRepository.findOneBy).toHaveBeenCalledWith({ id: 2 })
      expect(productRepository.findOneBy).toHaveBeenCalledTimes(1)
    })

    it('should throws if ProductRepository.findOneBy throws', async () => {
      jest
        .spyOn(productRepository, 'findOneBy')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const promise = sutProductService.findById(1)
      await expect(promise).rejects.toThrow()
    })

    it('should return null if product not exists', async () => {
      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValueOnce(Promise.resolve(null))
      const response = await sutProductService.findById(1)
      expect(response).toEqual(null)
    })

    it('should return a product on success', async () => {
      const response = await sutProductService.findById(1)
      expect(response).toEqual(productEntityMock)
    })
  })

  describe('save', () => {
    it('should call ProductRepository.save with correct values', async () => {
      const data = mockCreateProductDto()
      await sutProductService.save(1, data)
      expect(productRepository.save).toHaveBeenCalledWith({
        ...data,
        id: 1
      })
      expect(productRepository.save).toHaveBeenCalledTimes(1)
    })
    it('should throws if ProductRepository.save throws', async () => {
      const data = mockCreateProductDto()
      jest.spyOn(productRepository, 'save').mockImplementationOnce(async () => {
        throw new Error()
      })
      const promise = sutProductService.save(1, data)
      await expect(promise).rejects.toThrow()
    })

    it('should return a product on success', async () => {
      const data = mockCreateProductDto()
      const response = await sutProductService.save(1, data)
      expect(response).toEqual(productEntityMock)
    })
  })

  describe('remove', () => {
    it('should call ProductRepository.findOneBy with correct values', async () => {
      await sutProductService.remove(1)
      expect(productRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(productRepository.findOneBy).toHaveBeenCalledTimes(1)
    })

    it('should throws if ProductRepository.findOneBy throws', async () => {
      jest
        .spyOn(productRepository, 'findOneBy')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const promise = sutProductService.remove(1)
      await expect(promise).rejects.toThrow()
    })

    it('should call ProductRepository.save with correct deletedAt', async () => {
      productEntityMock.deletedAt = null
      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValueOnce(productEntityMock)
      expect(productEntityMock.deletedAt).toBe(null)
      const response = await sutProductService.remove(1)
      expect(productRepository.save).toHaveBeenCalledTimes(1)
      expect(response.deletedAt).toBeTruthy()
    })

    it('should throws if ProductRepository.save throws', async () => {
      jest.spyOn(productRepository, 'save').mockImplementationOnce(async () => {
        throw new Error()
      })
      const promise = sutProductService.remove(1)
      await expect(promise).rejects.toThrow()
    })

    it('should return a product on success', async () => {
      const response = await sutProductService.remove(1)
      expect(response).toEqual(productEntityMock)
    })
  })
})
