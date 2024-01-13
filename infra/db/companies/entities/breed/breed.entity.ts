import { AddDateColumns } from '../../../partials/add-date-columns'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity('breed')
export class Breed extends AddDateColumns {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string
}
