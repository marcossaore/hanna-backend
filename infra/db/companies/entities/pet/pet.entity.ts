import { PetCarries } from '@/shared/enums/pet-carries.enum'
import { AddDateColumns } from '../../../partials/add-date-columns'
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Customer } from '../customer/customer.entity'

@Entity('pet')
export class Pet extends AddDateColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  name: string

  @Column({ type: 'enum', enum: PetCarries })
  carry: PetCarries

  @Column({ nullable: false })
  breed: string

  @Column({ nullable: false })
  birthday: Date

  @ManyToOne(() => Customer, (customer: Customer) => customer.pet, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  customer: Customer

  @DeleteDateColumn({ type: 'timestamp', default: null, nullable: true })
  deletedAt: Date
}
