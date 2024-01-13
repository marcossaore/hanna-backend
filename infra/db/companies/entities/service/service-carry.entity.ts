import { AddDateColumns } from '../../../partials/add-date-columns'
import {
  Column,
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn
} from 'typeorm'
import { Service } from './service.entity'
import { Carry } from '../carry/carry.entity'

@Entity('service_carry')
export class ServiceCarry extends AddDateColumns {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Service, (service: Service) => service.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  service: Service

  @ManyToOne(() => Carry, (carry: Carry) => carry.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  carry: Carry

  @Column({ nullable: false })
  price: number
}
