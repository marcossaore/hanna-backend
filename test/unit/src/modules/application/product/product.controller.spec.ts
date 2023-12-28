import { Test, TestingModule } from '@nestjs/testing'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { ProductDto } from '@/modules/application/product/dto/product..dto'
import { StorageService } from '@/modules/infra/storage.service'
import { ProductController } from '@/modules/application/product/product.controller'
import { ProductService } from '@/modules/application/product/product.service'
import {
  mockProductEntity,
  mockCreateProductDto
} from '../../../../../unit/mock/product.mock'

describe('Controller: Product', () => {
  let sutProductController: ProductController
  let productService: ProductService
  let storageService: StorageService
  const productEntityMock = mockProductEntity()
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
      controllers: [ProductController],
      providers: [
        {
          provide: 'CONNECTION',
          useValue: {
            getRepository: jest.fn()
          }
        },
        {
          provide: ProductService,
          useValue: {
            create: jest.fn().mockResolvedValue(productEntityMock),
            existsCode: jest.fn().mockResolvedValue(false),
            verifyByCode: jest.fn(),
            find: jest
              .fn()
              .mockResolvedValue([
                [mockProductEntity(), mockProductEntity()],
                2
              ]),
            findById: jest.fn().mockResolvedValue(productEntityMock),
            save: jest.fn().mockResolvedValue(productEntityMock),
            remove: jest.fn().mockResolvedValue(productEntityMock)
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

    sutProductController = module.get<ProductController>(ProductController)
    productService = module.get<ProductService>(ProductService)
    storageService = module.get<StorageService>(StorageService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should call ProductService.existsCode if code is provided', async () => {
      const data = mockCreateProductDto({ code: 'any_code' })
      await sutProductController.create(sessionSpy, data)
      expect(productService.existsCode).toHaveBeenCalledWith(data.code)
      expect(productService.existsCode).toHaveBeenCalledTimes(1)
    })

    it('should not call ProductService.existsCode if code is not provided', async () => {
      const data = mockCreateProductDto()
      await sutProductController.create(sessionSpy, data)
      expect(productService.existsCode).toHaveBeenCalledTimes(0)
    })

    it('should throw if ProductService.existsCode returns true', async () => {
      jest.spyOn(productService, 'existsCode').mockResolvedValueOnce(true)
      const data = mockCreateProductDto({ code: 'any_code' })
      const promise = sutProductController.create(sessionSpy, data)
      await expect(promise).rejects.toThrow(
        'O produto com o código de barras informado já está cadastrado!'
      )
    })

    it('should throw if ProductService.existsCode throws', async () => {
      jest.spyOn(productService, 'existsCode').mockImplementationOnce(() => {
        throw new Error()
      })
      const data = mockCreateProductDto({ code: 'any_code' })
      const promise = sutProductController.create(sessionSpy, data)
      await expect(promise).rejects.toThrow()
    })

    it('should call ProductService.create with correct values', async () => {
      const data = mockCreateProductDto()
      await sutProductController.create(sessionSpy, data)
      expect(productService.create).toHaveBeenCalledWith({
        ...data,
        quantityKgActual: 0
      })
      expect(productService.create).toHaveBeenCalledTimes(1)
    })

    it('should call ProductService.create with correct values when quantityKgActual is provided without bulkPrice', async () => {
      const data = mockCreateProductDto({ quantityKgActual: 32 })
      await sutProductController.create(sessionSpy, data)
      expect(productService.create).toHaveBeenCalledWith({
        ...data,
        quantityKgActual: 0
      })
      expect(productService.create).toHaveBeenCalledTimes(1)
    })

    it('should call ProductService.create with correct values when product is bulk', async () => {
      const data = mockCreateProductDto({
        bulkPrice: 10000,
        quantityKg: 1000,
        quantityKgActual: 10
      })
      await sutProductController.create(sessionSpy, data)
      expect(productService.create).toHaveBeenCalledWith(data)
      expect(productService.create).toHaveBeenCalledTimes(1)
    })

    it('should throw if ProductService.create throws', async () => {
      jest.spyOn(productService, 'create').mockImplementationOnce(() => {
        throw new Error()
      })
      const data = mockCreateProductDto()
      const promise = sutProductController.create(sessionSpy, data)
      await expect(promise).rejects.toThrow()
    })

    it('should call StorageService.upload if thumb is provided', async () => {
      const data = mockCreateProductDto({ thumb: { buffer: 'any_thumb' } })
      await sutProductController.create(sessionSpy, data)
      expect(storageService.upload).toHaveBeenCalledWith(
        data.thumb.buffer,
        `${sessionSpy.auth.tenant.identifier}/products/${productEntityMock.id}`
      )
      expect(storageService.upload).toHaveBeenCalledTimes(1)
    })

    it('should throws if StorageService.upload throws', async () => {
      jest.spyOn(storageService, 'upload').mockImplementationOnce(() => {
        throw new Error()
      })
      const data = mockCreateProductDto({ thumb: { buffer: 'any_thumb' } })
      const promise = sutProductController.create(sessionSpy, data)
      await expect(promise).rejects.toThrow()
    })

    it('should return a product when succeds', async () => {
      const data = mockCreateProductDto()
      const response = await sutProductController.create(sessionSpy, data)
      expect(response).toEqual(
        new ProductDto({ ...productEntityMock, thumb: null })
      )
    })
  })

  describe('list', () => {
    it('should call ProductService.findAll with correct values', async () => {
      await sutProductController.list(sessionSpy)
      expect(productService.find).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
        code: '',
        name: ''
      })
      expect(productService.find).toHaveBeenCalledTimes(1)
    })

    it('should call ProductService.findAll with name', async () => {
      await sutProductController.list(sessionSpy, 10, 1, 'any_name')
      expect(productService.find).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
        code: '',
        name: 'any_name'
      })
      expect(productService.find).toHaveBeenCalledTimes(1)
    })

    it('should call ProductService.findAll with code', async () => {
      await sutProductController.list(sessionSpy, 10, 1, '', 'any_code')
      expect(productService.find).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
        name: '',
        code: 'any_code'
      })
      expect(productService.find).toHaveBeenCalledTimes(1)
    })

    it('should throw if ProductService.findAll throws', async () => {
      jest.spyOn(productService, 'find').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutProductController.list(sessionSpy)
      await expect(promise).rejects.toThrow()
    })

    it('should call StorageService.getUrl if', async () => {
      await sutProductController.list(sessionSpy)
      expect(storageService.getUrl).toHaveBeenCalledTimes(2)
    })

    it('should throws if StorageService.getUrl throws', async () => {
      jest.spyOn(storageService, 'getUrl').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutProductController.list(sessionSpy)
      await expect(promise).rejects.toThrow()
    })

    it('should return products when succeds', async () => {
      const response = await sutProductController.list(sessionSpy)
      expect(response.page).toBe(1)
      expect(response.totalPage).toBe(1)
      expect(response.items.length).toBe(2)
      expect(response.items[0]).toBeInstanceOf(ProductDto)
    })
  })

  describe('get', () => {
    it('should call ProductService.findById with correct value', async () => {
      await sutProductController.get(sessionSpy, '4')
      expect(productService.findById).toHaveBeenCalledWith(4)
      expect(productService.findById).toHaveBeenCalledTimes(1)
    })

    it('should throw if ProductService.findById returns null', async () => {
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(null)
      const promise = sutProductController.get(sessionSpy, '1')
      await expect(promise).rejects.toThrow('Produto não encontrado!')
    })

    it('should throw if ProductService.findById throws', async () => {
      jest.spyOn(productService, 'findById').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutProductController.get(sessionSpy, '3')
      await expect(promise).rejects.toThrow()
    })

    it('should call StorageService.getUrl with correct value', async () => {
      await sutProductController.get(sessionSpy, '1')
      expect(storageService.getUrl).toHaveBeenCalledWith(
        `${sessionSpy.auth.tenant.identifier}/products/${productEntityMock.id}`
      )
      expect(storageService.getUrl).toHaveBeenCalledTimes(1)
    })

    it('should throws if StorageService.getUrl throws', async () => {
      jest.spyOn(storageService, 'getUrl').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutProductController.get(sessionSpy, '1')
      await expect(promise).rejects.toThrow()
    })

    it('should return a product when succeds', async () => {
      const response = await sutProductController.get(sessionSpy, '1')
      expect(response).toEqual(
        new ProductDto({ ...productEntityMock, thumb: 'http://any_url' })
      )
    })
  })

  describe('update', () => {
    it('should call ProductService.verifyByCode if code is provided', async () => {
      const data = mockCreateProductDto({ code: 'any_code' })
      await sutProductController.update(sessionSpy, '4', data)
      expect(productService.verifyByCode).toHaveBeenCalledWith(4, data.code)
      expect(productService.verifyByCode).toHaveBeenCalledTimes(1)
    })

    it('should not call ProductService.verifyByCode if code is not provided', async () => {
      const data = mockCreateProductDto()
      await sutProductController.update(sessionSpy, '4', data)
      expect(productService.verifyByCode).toHaveBeenCalledTimes(0)
    })

    it('should throw if ProductService.verifyByCode returns product', async () => {
      jest
        .spyOn(productService, 'verifyByCode')
        .mockResolvedValueOnce(productEntityMock)
      const data = mockCreateProductDto({ code: 'any_code' })
      const promise = sutProductController.update(sessionSpy, '4', data)
      await expect(promise).rejects.toThrow(
        'O produto com o código de barras informado já está cadastrado!'
      )
    })

    it('should call ProductService.findById with correct value', async () => {
      const data = mockCreateProductDto()
      await sutProductController.update(sessionSpy, '4', data)
      expect(productService.findById).toHaveBeenCalledWith(4)
      expect(productService.findById).toHaveBeenCalledTimes(1)
    })

    it('should throw if ProductService.findById returns null', async () => {
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(null)
      const data = mockCreateProductDto()
      const promise = sutProductController.update(sessionSpy, '4', data)
      await expect(promise).rejects.toThrow('Produto não encontrado!')
    })

    it('should throw if ProductService.findById throws', async () => {
      jest.spyOn(productService, 'findById').mockImplementationOnce(() => {
        throw new Error()
      })
      const data = mockCreateProductDto()
      const promise = sutProductController.update(sessionSpy, '4', data)
      await expect(promise).rejects.toThrow()
    })

    it('should call StorageService.upload if thumb is provided', async () => {
      const data = mockCreateProductDto({ thumb: { buffer: 'any_thumb' } })
      await sutProductController.update(sessionSpy, '4', data)
      expect(storageService.upload).toHaveBeenCalledWith(
        data.thumb.buffer,
        `${sessionSpy.auth.tenant.identifier}/products/4`
      )
      expect(storageService.upload).toHaveBeenCalledTimes(1)
      expect(storageService.getUrl).toHaveBeenCalledTimes(0)
    })

    it('should call StorageService.getUrl if thumb is not provided', async () => {
      const data = mockCreateProductDto()
      await sutProductController.update(sessionSpy, '4', data)
      expect(storageService.getUrl).toHaveBeenCalledWith(
        `${sessionSpy.auth.tenant.identifier}/products/4`
      )
      expect(storageService.getUrl).toHaveBeenCalledTimes(1)
      expect(storageService.upload).toHaveBeenCalledTimes(0)
    })

    it('should throws if StorageService.upload throws', async () => {
      jest.spyOn(storageService, 'upload').mockImplementationOnce(() => {
        throw new Error()
      })
      const data = mockCreateProductDto({ thumb: { buffer: 'any_thumb' } })
      const promise = sutProductController.update(sessionSpy, '4', data)
      await expect(promise).rejects.toThrow()
    })

    it('should throws if StorageService.getUrl throws', async () => {
      jest.spyOn(storageService, 'getUrl').mockImplementationOnce(() => {
        throw new Error()
      })
      const data = mockCreateProductDto()
      const promise = sutProductController.update(sessionSpy, '4', data)
      await expect(promise).rejects.toThrow()
    })

    it('should return a product when succeds', async () => {
      const data = mockCreateProductDto()
      const response = await sutProductController.update(sessionSpy, '4', data)
      expect(response).toEqual(
        new ProductDto({ ...productEntityMock, thumb: 'http://any_url' })
      )
    })
  })

  describe('remove', () => {
    it('should call ProductService.findById with correct value', async () => {
      await sutProductController.remove('1')
      expect(productService.findById).toHaveBeenCalledWith(1)
      expect(productService.findById).toHaveBeenCalledTimes(1)
    })

    it('should throw if ProductService.findOne returns null', async () => {
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(null)
      const promise = sutProductController.remove('4')
      await expect(promise).rejects.toThrow('Produto não encontrado!')
    })

    it('should throw if ProductService.findById throws', async () => {
      jest.spyOn(productService, 'findById').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutProductController.remove('4')
      await expect(promise).rejects.toThrow()
    })

    it('should call ProductService.remove with correct id', async () => {
      await sutProductController.remove('4')
      expect(productService.remove).toHaveBeenCalledWith(4)
      expect(productService.remove).toHaveBeenCalledTimes(1)
    })

    it('should throw if ProductService.remove throws', async () => {
      jest.spyOn(productService, 'remove').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sutProductController.remove('4')
      await expect(promise).rejects.toThrow()
    })
  })
})
