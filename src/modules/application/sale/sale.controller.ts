import {
  Controller,
  Post,
  Body,
  NotFoundException,
  UseGuards,
  Session,
  BadRequestException,
  UnauthorizedException
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
      amount += convertToFloatWithTwoDecimals(
        (product.bulkPrice || product.price) * order.quantity
      )
    }

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
          'Para o método de pagamento conta é necenessário informar o cliente!'
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
        amount
      })
    }
  }
}
