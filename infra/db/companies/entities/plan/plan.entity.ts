import { AddDateColumns } from '../../../partials/add-date-columns'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Service } from '../service/service.entity'

@Entity('plan')
export class Plan extends AddDateColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  name: string

  @Column({ nullable: false })
  bathTimes: number

  @Column({ nullable: false })
  groomingTimes: number

  @Column({ nullable: false })
  allowedDays: string

  @Column({ nullable: false })
  monthlyPayment: number

  @ManyToMany(() => Service, service => service.plans)
  @JoinTable({
    name: 'plan_services',
    joinColumn: {
      name: 'serviceId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'planId',
      referencedColumnName: 'id'
    }
  })
  services: Service[];
}