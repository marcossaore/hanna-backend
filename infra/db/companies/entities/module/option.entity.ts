import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { AddDateColumns } from '@infra/db/partials/add-date-columns'
import { Module } from './module.entity'

@Entity('rbac_option')
export class Option extends AddDateColumns {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false, unique: true })
  name: string

  @ManyToMany(() => Module, (module) => module.options)
  modules: Module[]
}
