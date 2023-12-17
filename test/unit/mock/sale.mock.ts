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
