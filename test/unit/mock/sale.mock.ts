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
