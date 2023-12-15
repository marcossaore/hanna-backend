import { AddDateColumns } from '../../../partials/add-date-columns'
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity('product')
export class Product extends AddDateColumns {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string

  @Column({ nullable: true })
  description?: string

  @Column({ nullable: false })
  price: number

  @Column({ nullable: true })
  bulkPrice?: number

  @Column({ nullable: true })
  code?: string

  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deletedAt: Date
}