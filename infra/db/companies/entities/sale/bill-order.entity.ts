import { AddDateColumns } from '../../../partials/add-date-columns'
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Product } from '../product/product.entity'
import { Bill } from './bill.entity'

@Entity('bill_order')
export class BillOrder extends AddDateColumns {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Product, (product: Product) => product.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  product: Product

  @Column({ nullable: false })
  quantity: number

  @ManyToOne(() => Bill, (bill: Bill) => bill.id)
  bill: Bill

  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deletedAt: Date
}
