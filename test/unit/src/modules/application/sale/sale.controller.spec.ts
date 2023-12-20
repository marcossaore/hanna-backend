import { Test, TestingModule } from '@nestjs/testing'
import { mockProductEntity } from '../../../../../unit/mock/product.mock'
import { mockCustomerEntity } from '../../../../../unit/mock/customer.mock'
import { mockCreateSaleDto } from '../../../../../unit/mock/sale.mock'
import {
  convertFloatToInt,
  convertToFloatWithTwoDecimals
} from '@/adapters/helpers/general'
import { Product } from '@infra/db/companies/entities/product/product.entity'
import { Customer } from '@infra/db/companies/entities/customer/customer.entity'
import { CreateSaleDto } from '@/modules/application/sale/dto/create-sale.dto'
import { SaleService } from '@/modules/application/sale/sale.service'
import { ProductService } from '@/modules/application/product/product.service'
import { CustomerService } from '@/modules/application/customer/customer.service'
import { BillService } from '@/modules/application/bill/bill.service'
import { SaleController } from '@/modules/application/sale/sale.controller'

describe('Controller: SaleController', () => {
  let sutController: SaleController
  let saleService: SaleService
  let productService: ProductService
  let customerService: CustomerService
  let billService: BillService
  let productEntity: Product
  const customerEntity: Customer = mockCustomerEntity()
  const orders = [
    {
      productId: 1,
      quantity: 2
    },
    {
      productId: 2,
      quantity: 4
    }
  ]
  const createSaleDto = ({
    paymentMethod = 'money',
    replaceOrders = null,
    customerId = null,
    times = null,
    discount = null,
    fee = null
  } = {}): CreateSaleDto => {
    return mockCreateSaleDto({
      paymentMethod,
      orders: replaceOrders || orders,
      customerId,
      times,
      discount,
      fee
    })
  }

  let sessionSpy: any

  beforeEach(async () => {
    productEntity = mockProductEntity()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleController],
      providers: [
        {
          provide: 'CONNECTION',
          useValue: {
            getRepository: jest.fn()
          }
        },
        {
          provide: SaleService,
          useValue: {
            create: jest.fn()
          }
        },
        {
          provide: ProductService,
          useValue: {
            findById: jest.fn().mockResolvedValue(productEntity),
            save: jest.fn()
          }
        },
        {
          provide: CustomerService,
          useValue: {
            exists: jest.fn().mockResolvedValue(customerEntity)
          }
        },
        {
          provide: BillService,
          useValue: {
            create: jest.fn()
          }
        }
      ]
    }).compile()

    sessionSpy = {
      auth: {
        user: {
          permissions: [
            {
              name: 'sales',
              options: {
                billMode: true
              }
            }
          ]
        }
      }
    }

    sutController = module.get<SaleController>(SaleController)
    saleService = module.get<SaleService>(SaleService)
    productService = module.get<ProductService>(ProductService)
    customerService = module.get<CustomerService>(CustomerService)
    billService = module.get<BillService>(BillService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should call ProductService.findById with correct values', async () => {
      const createSale = createSaleDto()
      await sutController.create(sessionSpy, createSale)
      expect(productService.findById).toHaveBeenCalledWith(
        createSale.orders[0].productId
      )
      expect(productService.findById).toHaveBeenCalledWith(
        createSale.orders[1].productId
      )
      expect(productService.findById).toHaveBeenCalledTimes(2)
    })

    it('should throw if ProductService.findById not found a product', async () => {
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(null)
      const createSale = createSaleDto()
      const promise = sutController.create(sessionSpy, createSale)
      await expect(promise).rejects.toThrow(
        `Produto não encontrado: ${createSale.orders[0].productId}`
      )
    })

    it('should throw if ProductService.findById throws', async () => {
      jest.spyOn(productService, 'findById').mockImplementationOnce(() => {
        throw new Error()
      })
      const createSale = createSaleDto()
      const promise = sutController.create(sessionSpy, createSale)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should throw if no exists stock', async () => {
      const product = mockProductEntity({ quantity: 0 })
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(product)
      const createSale = createSaleDto()
      const promise = sutController.create(sessionSpy, createSale)
      await expect(promise).rejects.toThrow(
        `Não há "${product.name}" no estoque!`
      )
    })

    it('should throw if no order quantity is greather than stock', async () => {
      const product = mockProductEntity({ quantity: 2 })
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(product)
      const createSale = createSaleDto({
        replaceOrders: [{ productId: 1, quantity: 10 }]
      })
      const promise = sutController.create(sessionSpy, createSale)
      await expect(promise).rejects.toThrow(
        new Error(
          `A quantidade máxima de "${product.name}" no estoque é ${product.quantity}`
        )
      )
    })

    it('bulk: should call productService.save with correct values', async () => {
      const product = mockProductEntity({
        bulkPrice: 1250,
        quantity: 1,
        quantityKg: 7
      })
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(product)
      const saleDto = createSaleDto({
        replaceOrders: [{ productId: 1, quantity: 3000 }]
      })
      await sutController.create(sessionSpy, saleDto)
      expect(productService.save).toHaveBeenCalledWith(product.id, {
        ...product,
        quantity: 0,
        quantityKg: 7
      })
      expect(productService.save).toHaveBeenCalledTimes(1)
    })

    it('bulk: should throw if order.quantity is less than allowed 100 grams', async () => {
      const product = mockProductEntity({
        bulkPrice: 1250
      })
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(product)
      const createSale = createSaleDto({
        replaceOrders: [{ productId: 1, quantity: 10 }]
      })
      const promise = sutController.create(sessionSpy, createSale)
      await expect(promise).rejects.toThrow(
        new Error('A quantidade mínima de compra deve ser 100 gramas!')
      )
    })

    it('bulk: should call productService.save with correct values (quantityKgActual greather than order quantity)', async () => {
      const product = mockProductEntity({
        bulkPrice: 1250,
        quantityKgActual: 3,
        quantity: 1
      })
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(product)
      const createSale = createSaleDto({
        replaceOrders: [{ productId: 1, quantity: 2200 }]
      })
      await sutController.create(sessionSpy, createSale)
      expect(productService.save).toHaveBeenCalledWith(product.id, {
        ...product,
        quantityKgActual: 0.8
      })
      expect(productService.save).toHaveBeenCalledTimes(1)
    })

    it('bulk: should call productService.save with correct values (quantityKgActual equals order quantity)', async () => {
      const product = mockProductEntity({
        bulkPrice: 1250,
        quantityKgActual: 3,
        quantityKg: 12,
        quantity: 2
      })
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(product)
      const createSale = createSaleDto({
        replaceOrders: [{ productId: 1, quantity: 3000 }]
      })
      await sutController.create(sessionSpy, createSale)
      expect(productService.save).toHaveBeenCalledWith(product.id, {
        ...product,
        quantityKgActual: 12,
        quantity: 1
      })
      expect(productService.save).toHaveBeenCalledTimes(1)
    })

    it('bulk: should call productService.save with correct values (quantityKgActual and quantity equal 0)', async () => {
      const product = mockProductEntity({
        bulkPrice: 1250,
        quantityKgActual: 3,
        quantityKg: 12,
        quantity: 0
      })
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(product)
      const createSale = createSaleDto({
        replaceOrders: [{ productId: 1, quantity: 3000 }]
      })
      await sutController.create(sessionSpy, createSale)
      expect(productService.save).toHaveBeenCalledWith(product.id, {
        ...product,
        quantityKgActual: 0,
        quantity: 0
      })
      expect(productService.save).toHaveBeenCalledTimes(1)
    })

    it('bulk: should throw if quantity is 0 and quantityKgActual is less than order quantity', async () => {
      const product = mockProductEntity({
        bulkPrice: 1250,
        quantityKgActual: 2,
        quantityKg: 12,
        quantity: 0
      })
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(product)
      const createSale = createSaleDto({
        replaceOrders: [{ productId: 1, quantity: 3000 }]
      })
      const promise = sutController.create(sessionSpy, createSale)
      await expect(promise).rejects.toThrow(
        `A quantidade máxima de "${product.name}" no estoque é ${product.quantityKgActual} KG!`
      )
    })

    it('bulk: should throw if no exists stock', async () => {
      const product = mockProductEntity({
        bulkPrice: 1250,
        quantityKgActual: 0,
        quantityKg: 12,
        quantity: 0
      })
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(product)
      const createSale = createSaleDto({
        replaceOrders: [{ productId: 1, quantity: 3000 }]
      })
      const promise = sutController.create(sessionSpy, createSale)
      await expect(promise).rejects.toThrow(
        `Não há "${product.name}" no estoque!`
      )
    })

    it('bulk: should throw if bulk quantity is more than quantityKg', async () => {
      const product = mockProductEntity({
        bulkPrice: 1250,
        quantityKgActual: 0,
        quantityKg: 12,
        quantity: 2
      })
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(product)
      const createSale = createSaleDto({
        replaceOrders: [{ productId: 1, quantity: 13000 }]
      })
      const promise = sutController.create(sessionSpy, createSale)
      await expect(promise).rejects.toThrow(
        `A quantidade máxima de compra de ${product.name} é ${product.quantityKg}!`
      )
    })

    it('bulk: should call productService.save with correct values (quantityKgActual less than order quantity)', async () => {
      const product = mockProductEntity({
        bulkPrice: 1250,
        quantityKgActual: 3,
        quantityKg: 12,
        quantity: 1
      })
      jest.spyOn(productService, 'findById').mockResolvedValueOnce(product)
      const createSale = createSaleDto({
        replaceOrders: [{ productId: 1, quantity: 4500 }]
      })
      await sutController.create(sessionSpy, createSale)
      expect(productService.save).toHaveBeenCalledWith(product.id, {
        ...product,
        quantityKgActual: 10.5,
        quantity: 0
      })
      expect(productService.save).toHaveBeenCalledTimes(1)
    })

    it('should call CustomerService.exists with correct customerId when it is provided', async () => {
      const createSale = createSaleDto({ customerId: 'any_id' })
      await sutController.create(sessionSpy, createSale)
      expect(customerService.exists).toHaveBeenCalledWith('any_id')
      expect(customerService.exists).toHaveBeenCalledTimes(1)
    })

    it('should throws if CustomerService.exists not found a customer', async () => {
      jest.spyOn(customerService, 'exists').mockResolvedValueOnce(false)
      const createSale = createSaleDto({ customerId: 'any_id' })
      const promise = sutController.create(sessionSpy, createSale)
      await expect(promise).rejects.toThrow(`Cliente não encontrado!`)
    })

    it('should throw if CustomerService.exists throws', async () => {
      jest.spyOn(customerService, 'exists').mockImplementationOnce(() => {
        throw new Error()
      })
      const createSale = createSaleDto({ customerId: 'any_id' })
      const promise = sutController.create(sessionSpy, createSale)
      await expect(promise).rejects.toThrow(new Error())
    })

    it('should throw if paymment method is bill but option billMode is not active', async () => {
      sessionSpy.auth.user.permissions[0].options.billMode = false
      const createSale = createSaleDto({ paymentMethod: 'bill' })
      const promise = sutController.create(sessionSpy, createSale)
      await expect(promise).rejects.toThrow(
        new Error('Você não possui permissão para o módulo de venda em conta!')
      )
    })

    it('should throw if paymment method is bill, option billMode is active, but customerId is not provided', async () => {
      const createSale = createSaleDto({ paymentMethod: 'bill' })
      const promise = sutController.create(sessionSpy, createSale)
      await expect(promise).rejects.toThrow(
        new Error(
          'Para o método de pagamento "conta", é necessário informar o cliente!'
        )
      )
    })

    it('should call BillService.create with correct values payment method bill and customerId is provided', async () => {
      const createSale = createSaleDto({
        paymentMethod: 'bill',
        customerId: 'any_id'
      })
      await sutController.create(sessionSpy, createSale)
      orders[0]['product'] = {
        id: productEntity.id
      }
      orders[1]['product'] = {
        id: productEntity.id
      }
      let amount = convertToFloatWithTwoDecimals(
        productEntity.price * orders[0].quantity
      )
      amount += convertToFloatWithTwoDecimals(
        productEntity.price * orders[1].quantity
      )
      amount = convertFloatToInt(amount)

      expect(billService.create).toHaveBeenCalledWith({
        ...createSale,
        orders: orders,
        amount
      })
      expect(billService.create).toHaveBeenCalledTimes(1)
    })

    it('should throw if BillService.create throws', async () => {
      jest.spyOn(billService, 'create').mockImplementationOnce(() => {
        throw new Error()
      })
      const createSale = createSaleDto({
        paymentMethod: 'bill',
        customerId: 'any_id'
      })
      const promise = sutController.create(sessionSpy, createSale)
      await expect(promise).rejects.toThrow()
    })

    it('should call SaleService.create with correct values when paymment method is not equals bill', async () => {
      const createSale = createSaleDto({ paymentMethod: 'money' })
      await sutController.create(sessionSpy, createSale)
      orders[0]['product'] = {
        id: productEntity.id
      }
      orders[1]['product'] = {
        id: productEntity.id
      }
      let amount = convertToFloatWithTwoDecimals(
        productEntity.price * orders[0].quantity
      )
      amount += convertToFloatWithTwoDecimals(
        productEntity.price * orders[1].quantity
      )
      amount = convertFloatToInt(amount)

      expect(saleService.create).toHaveBeenCalledWith({
        ...createSale,
        orders: orders,
        originalAmount: amount,
        amount,
        times: 1
      })
      expect(saleService.create).toHaveBeenCalledTimes(1)
    })

    it('should call SaleService.create with times equals 1 when the payment method is not credit and times is greather then 1', async () => {
      const createSale = createSaleDto({ paymentMethod: 'money', times: 12 })
      await sutController.create(sessionSpy, createSale)
      orders[0]['product'] = {
        id: productEntity.id
      }
      orders[1]['product'] = {
        id: productEntity.id
      }
      let amount = convertToFloatWithTwoDecimals(
        productEntity.price * orders[0].quantity
      )
      amount += convertToFloatWithTwoDecimals(
        productEntity.price * orders[1].quantity
      )
      amount = convertFloatToInt(amount)

      expect(saleService.create).toHaveBeenCalledWith({
        ...createSale,
        orders: orders,
        originalAmount: amount,
        amount,
        times: 1
      })
      expect(saleService.create).toHaveBeenCalledTimes(1)
    })

    it('should call SaleService.create with correct times when method is credit', async () => {
      const createSale = createSaleDto({ paymentMethod: 'credit', times: 12 })
      await sutController.create(sessionSpy, createSale)
      orders[0]['product'] = {
        id: productEntity.id
      }
      orders[1]['product'] = {
        id: productEntity.id
      }
      let amount = convertToFloatWithTwoDecimals(
        productEntity.price * orders[0].quantity
      )
      amount += convertToFloatWithTwoDecimals(
        productEntity.price * orders[1].quantity
      )
      amount = convertFloatToInt(amount)

      expect(saleService.create).toHaveBeenCalledWith({
        ...createSale,
        orders: orders,
        originalAmount: amount,
        amount,
        times: 12
      })
      expect(saleService.create).toHaveBeenCalledTimes(1)
    })

    it('should call SaleService.create with correct discount value', async () => {
      const createSale = createSaleDto({
        paymentMethod: 'money',
        discount: 5.5
      })
      await sutController.create(sessionSpy, createSale)
      orders[0]['product'] = {
        id: productEntity.id
      }
      orders[1]['product'] = {
        id: productEntity.id
      }
      let amount = convertToFloatWithTwoDecimals(
        productEntity.price * orders[0].quantity
      )
      amount += convertToFloatWithTwoDecimals(
        productEntity.price * orders[1].quantity
      )

      const originalAmount = convertFloatToInt(amount)

      amount = Number(amount)
      amount -= (5.5 * amount) / 100
      amount = convertFloatToInt(amount)

      expect(saleService.create).toHaveBeenCalledWith({
        ...createSale,
        orders: orders,
        originalAmount,
        amount,
        times: 1
      })
      expect(saleService.create).toHaveBeenCalledTimes(1)
    })

    it('should call SaleService.create with correct fee value', async () => {
      const createSale = createSaleDto({ paymentMethod: 'money', fee: 7.45 })
      await sutController.create(sessionSpy, createSale)
      orders[0]['product'] = {
        id: productEntity.id
      }
      orders[1]['product'] = {
        id: productEntity.id
      }
      let amount = convertToFloatWithTwoDecimals(
        productEntity.price * orders[0].quantity
      )
      amount += convertToFloatWithTwoDecimals(
        productEntity.price * orders[1].quantity
      )

      const originalAmount = convertFloatToInt(amount)
      amount = Number(amount)
      amount += (7.45 * amount) / 100
      amount = convertFloatToInt(amount)

      expect(saleService.create).toHaveBeenCalledWith({
        ...createSale,
        orders: orders,
        originalAmount,
        amount,
        times: 1
      })
      expect(saleService.create).toHaveBeenCalledTimes(1)
    })

    it('should throw if SaleService.create throws', async () => {
      jest.spyOn(saleService, 'create').mockImplementationOnce(() => {
        throw new Error()
      })
      const createSale = createSaleDto()
      const promise = sutController.create(sessionSpy, createSale)
      await expect(promise).rejects.toThrow()
    })

    it('should not return on success', async () => {
      const createSale = createSaleDto()
      const response = await sutController.create(sessionSpy, createSale)
      expect(response).toBeUndefined()
    })
  })
})
