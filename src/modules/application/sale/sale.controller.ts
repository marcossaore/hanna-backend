import {
  Controller,
  Post,
  Body,
  NotFoundException,
  UseGuards,
  Session,
  BadRequestException,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common'
import {
  convertFloatToInt,
  convertToFloatWithTwoDecimals
} from '@/adapters/helpers/general'
import { appPrefix } from '../app/application.prefixes'
import { PaymentMethodStatus } from '@/shared/enums/payment-method-status.enum'
import { Permissions } from '../auth/permissions/permission.decorator'
import { PermissionsGuard } from '../auth/permissions/permission.guard'
import { AuthenticatedGuard } from '../auth/authenticated.guard'
import { CreateSaleDto } from './dto/create-sale.dto'
import { SaleService } from './sale.service'
import { ProductService } from '../product/product.service'
import { CustomerService } from '../customer/customer.service'
import { BillService } from '../bill/bill.service'

@Controller(`${appPrefix}/sales`)
export class SaleController {
  constructor(
    private readonly saleService: SaleService,
    private readonly productService: ProductService,
    private readonly customerService: CustomerService,
    private readonly billService: BillService
  ) {}

  @Post()
  @Permissions('sales', 'create')
  @UseGuards(AuthenticatedGuard)
  @UseGuards(PermissionsGuard)
  async create(
    @Session() session,
    @Body() createSaleDto: CreateSaleDto
  ): Promise<void> {
    let amount = 0
    const orders = []
    for await (const order of createSaleDto.orders) {
      const product = await this.productService.findById(order.productId)
      if (!product) {
        throw new NotFoundException(
          `Produto não encontrado: ${order.productId}!`
        )
      }
      orders.push({
        ...order,
        product: {
          id: product.id
        }
      })

      if (product.bulkPrice) {
        if (order.quantity < 100) {
          throw new BadRequestException(
            `A quantidade mínima de compra deve ser 100 gramas!`
          )
        }
        const bulkQuantity = order.quantity / 1000
        if (product.quantityKgActual >= bulkQuantity) {
          product.quantityKgActual -= bulkQuantity
          if (product.quantityKgActual === 0) {
            if (product.quantity > 0) {
              product.quantityKgActual = product.quantityKg
              product.quantity--
            } else {
              product.quantityKgActual = 0
            }
          }
        } else {
          if (product.quantity === 0 && product.quantityKgActual > 0) {
            throw new NotFoundException(
              `A quantidade máxima de "${product.name}" no estoque é ${product.quantityKgActual} KG!`
            )
          }

          if (product.quantity === 0 && product.quantityKgActual === 0) {
            throw new UnprocessableEntityException(
              `Não há "${product.name}" no estoque!`
            )
          }

          if (bulkQuantity > product.quantityKg) {
            throw new UnprocessableEntityException(
              `A quantidade máxima de compra de ${product.name} é ${product.quantityKg}!`
            )
          }

          const bulkQuantityDiff = bulkQuantity - product.quantityKgActual
          product.quantityKgActual = product.quantityKg - bulkQuantityDiff
          product.quantity--
        }

        amount += convertToFloatWithTwoDecimals(
          product.bulkPrice * bulkQuantity
        )
      } else {
        if (product.quantity === 0) {
          throw new UnprocessableEntityException(
            `Não há "${product.name}" no estoque!`
          )
        }
        if (product.quantity < order.quantity) {
          throw new UnprocessableEntityException(
            `A quantidade máxima de "${product.name}" no estoque é ${product.quantity}`
          )
        }
        product.quantity -= order.quantity
        amount += convertToFloatWithTwoDecimals(product.price * order.quantity)
      }

      product.quantityKgActual = Number(product.quantityKgActual.toPrecision(4))

      await this.productService.save(product.id, product)
    }

    const originalAmount = convertFloatToInt(amount)

    amount = Number(amount)
    amount -= ((createSaleDto.discount || 0) * amount) / 100
    amount += ((createSaleDto.fee || 0) * amount) / 100
    amount = convertFloatToInt(amount)

    if (createSaleDto.customerId) {
      const existsCustomer = await this.customerService.exists(
        createSaleDto.customerId
      )
      if (!existsCustomer) {
        throw new NotFoundException(`Cliente não encontrado!`)
      }
      createSaleDto['customer'] = {
        id: createSaleDto.customerId
      }
    }

    if (createSaleDto.paymentMethod === PaymentMethodStatus.BILL) {
      const { options } = session.auth.user.permissions.filter(
        ({ name }) => name === 'sales'
      )[0]
      if (!options.billMode) {
        throw new UnauthorizedException(
          'Você não possui permissão para o módulo de venda em conta!'
        )
      }
      if (!createSaleDto.customerId) {
        throw new BadRequestException(
          'Para o método de pagamento "conta", é necessário informar o cliente!'
        )
      }
      this.billService.create({
        ...createSaleDto,
        orders: orders,
        amount
      })
    } else {
      this.saleService.create({
        ...createSaleDto,
        orders: orders,
        times:
          createSaleDto.paymentMethod != 'credit'
            ? 1
            : createSaleDto.times || 1,
        originalAmount,
        amount
      })
    }
  }
}
