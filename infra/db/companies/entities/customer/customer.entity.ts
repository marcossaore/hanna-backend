import { AddDateColumns } from '../../../partials/add-date-columns'
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Sale } from '../sale/sale.entity'
import { Bill } from '../sale/bill.entity'
import { Pet } from '../pet/pet.entity'

@Entity('customer')
export class Customer extends AddDateColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  name: string

  @Column({ nullable: false, unique: true })
  phone: string

  @Column({ nullable: true, unique: true })
  email?: string

  @Column({ nullable: false })
  street: string

  @Column({ nullable: true })
  number?: string

  @Column({ nullable: true })
  complement?: string

  @Column({ nullable: false })
  neighborhood: string

  @Column({ nullable: false })
  city: string

  @Column({ nullable: false })
  state: string

  @Column({ nullable: false })
  country: string

  @OneToMany(() => Sale, (sale) => sale.customer)
  sales: Sale[]

  @OneToMany(() => Bill, (bill) => bill.customer)
  bills: Bill[]

  @OneToMany(() => Pet, (pet: Pet) => pet.customer)
  pet: Pet[]

  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deletedAt: Date
}
