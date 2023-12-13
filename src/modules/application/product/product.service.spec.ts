import { Test, TestingModule } from '@nestjs/testing'
import { ProductService } from './product.service'
import {
  mockCreateProductDto,
  mockProductEntity
} from '../../../../test/unit/mock/product.mock'
const pageOptions = { limit: 1, page: 1 }

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
      existsCode: jest.fn().mockResolvedValue(false),
      findAndCount: jest
        .fn()
        .mockResolvedValue([[productEntityMock, productEntityMock], 2]),
      findOneBy: jest.fn().mockResolvedValue(productEntityMock),
      save: jest.fn().mockResolvedValue(productEntityMock),
      remmove: jest.fn().mockResolvedValue(productEntityMock)
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should call CustomerRepository.save with correct values', async () => {
      const data = mockCreateProductDto()
      await sutProductService.create(data)
      expect(productRepository.save).toHaveBeenCalledWith(data)
      expect(productRepository.save).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerRepository.save throws', async () => {
      const data = mockCreateProductDto()
      jest.spyOn(productRepository, 'save').mockImplementationOnce(async () => {
        throw new Error()
      })
      const promise = sutProductService.create(data)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('existsCode', () => {
    it('should call CustomerRepository.findOneBy with correct email', async () => {
      await sutProductService.existsCode('any_code')
      expect(productRepository.findOneBy).toHaveBeenCalledWith({
        code: 'any_code'
      })
      expect(productRepository.findOneBy).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerRepository.findOneBy throws', async () => {
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

  describe('findAll', () => {
    it('should call ProductRepository.findAndCount with values', async () => {
      await sutProductService.findAll(pageOptions)
      expect(productRepository.findAndCount).toHaveBeenCalledWith({
        take: pageOptions.limit,
        skip: pageOptions.page - 1,
        order: {
          createdAt: 'DESC'
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
      const promise = sutProductService.findAll(pageOptions)
      await expect(promise).rejects.toThrow()
    })

    it('should return array if do not have any product', async () => {
      jest
        .spyOn(productRepository, 'findAndCount')
        .mockResolvedValueOnce(Promise.resolve([]))
      const response = await sutProductService.findAll(pageOptions)
      expect(response).toEqual([])
    })

    it('should return products on success', async () => {
      const response = await sutProductService.findAll(pageOptions)
      expect(response.length).toEqual(2)
    })
  })

  describe('findOne', () => {
    it('should call ProductRepository.findOneBy with correct values', async () => {
      await sutProductService.findOne(2)
      expect(productRepository.findOneBy).toHaveBeenCalledWith({ id: 2 })
      expect(productRepository.findOneBy).toHaveBeenCalledTimes(1)
    })

    it('should throws if ProductRepository.findOneBy throws', async () => {
      jest
        .spyOn(productRepository, 'findOneBy')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const promise = sutProductService.findOne(1)
      await expect(promise).rejects.toThrow()
    })

    it('should return null if product not exists', async () => {
      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValueOnce(Promise.resolve(null))
      const response = await sutProductService.findOne(1)
      expect(response).toEqual(null)
    })

    it('should return a product on success', async () => {
      const response = await sutProductService.findOne(1)
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
