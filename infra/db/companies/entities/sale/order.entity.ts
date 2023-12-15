import { AddDateColumns } from '../../../partials/add-date-columns'
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Product } from '../product/product.entity'
import { Sale } from './sale.entity'

@Entity('order')
export class Order extends AddDateColumns {
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

  @ManyToOne(() => Sale, (sale: Sale) => sale.id)
  sale: Sale

  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deletedAt: Date
}
