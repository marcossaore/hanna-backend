import { CreateBillDto } from '@/modules/application/bill/dto/create-bill.dto'
import { CreateSaleDto } from '@/modules/application/sale/dto/create-sale.dto'

export const mockCreateSaleDto = ({
  paymentMethod,
  orders,
  discount = null,
  fee = null,
  times = null,
  customerId = null
}): CreateSaleDto => ({
  paymentMethod,
  orders,
  discount,
  fee,
  times,
  customerId
})

export const mockCreateSaleWithAmount = (): CreateSaleDto & {
  amount: number
} => {
  const orders = [
    {
      quantity: 2,
      product: {
        id: 1
      }
    },
    {
      quantity: 3,
      product: {
        id: 2
      }
    }
  ]
  const data = mockCreateSaleDto({ paymentMethod: 'money', orders })
  return {
    ...data,
    amount: 20744
  }
}

export const mockCreateBillDto = (): CreateBillDto => {
  const orders = [
    {
      quantity: 2,
      productId: 1,
      product: {
        id: 1
      }
    },
    {
      quantity: 3,
      productId: 2,
      product: {
        id: 2
      }
    }
  ]
  const bill = {
    paymentMethod: 'bill',
    customerId: 'any_id',
    orders
  } as any

  return bill as CreateBillDto
}

export const mockCreateBillDtoWithAmount = (): CreateBillDto & {
  amount: number
} => {
  const bill = mockCreateBillDto()
  return {
    ...bill,
    amount: 26409
  } as CreateBillDto & { amount: number }
}
