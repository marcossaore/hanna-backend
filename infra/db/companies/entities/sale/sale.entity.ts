import { PaymentMethodStatus } from '@/shared/enums/payment-method-status.enum'
import { Customer } from '../customer/customer.entity'
import { AddDateColumns } from '../../../partials/add-date-columns'
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Order } from './order.entity'

@Entity('sales')
export class Sale extends AddDateColumns {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'enum', enum: PaymentMethodStatus })
  paymentMethod: string

  @Column({ nullable: true })
  times: number

  @Column({ nullable: true, type: 'float' })
  fee: number

  @Column({ nullable: true, type: 'float' })
  discount: number

  @Column({ nullable: false })
  amount: number

  @Column({ nullable: false })
  originalAmount: number

  @ManyToOne(() => Customer, (customer: Customer) => customer.sales, {
    nullable: true,
    // eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  customer: Customer

  @OneToMany(() => Order, (order: Order) => order.sale, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  orders: Order[]

  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deletedAt: Date
}
