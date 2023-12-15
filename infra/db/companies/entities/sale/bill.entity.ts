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
import { BillOrder } from './bill-order.entity'

@Entity('bill')
export class Bill extends AddDateColumns {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  amount: number

  @ManyToOne(() => Customer, (customer: Customer) => customer.sales, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  customer: Customer

  @OneToMany(() => BillOrder, (order: BillOrder) => order.bill, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  orders: BillOrder[]

  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deletedAt: Date
}
