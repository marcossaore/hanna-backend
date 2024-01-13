import { AddDateColumns } from '../../../partials/add-date-columns'
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { ServiceCarry } from './service-carry.entity';

@Entity('service')
export class Service extends AddDateColumns {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string

  @OneToMany(() => ServiceCarry, serviceCarry => serviceCarry.service)
  serviceCarries: ServiceCarry[];
}
