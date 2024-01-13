import { AddDateColumns } from '../../../partials/add-date-columns'
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { ServiceCarry } from '../service/service-carry.entity';

@Entity('carry')
export class Carry extends AddDateColumns {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string

  @OneToMany(() => ServiceCarry, serviceCarry => serviceCarry.service)
  serviceCarries: ServiceCarry[];
}
