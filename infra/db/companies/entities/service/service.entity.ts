import { AddDateColumns } from '../../../partials/add-date-columns'
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { ServiceCarry } from './service-carry.entity';
import { Plan } from '../plan/plan.entity';

@Entity('service')
export class Service extends AddDateColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  name: string

  @OneToMany(() => ServiceCarry, serviceCarry => serviceCarry.service)
  serviceCarries: ServiceCarry[];

  @ManyToMany(() => Plan, plan => plan.services)
  plans: Plan[];
}
