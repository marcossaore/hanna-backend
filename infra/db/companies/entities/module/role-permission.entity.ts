import {
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { AddDateColumns } from '@infra/db/partials/add-date-columns'
import { Module } from './module.entity'
import { Role } from './role.entity'
import { Grant } from './grant.entity'
import { RolePermissionOption } from './role-permission-option.entity'

@Entity('rbac_role_permission')
export class RolePermission extends AddDateColumns {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Role, (role: Role) => role.permissions)
  role: Role

  @ManyToOne(() => Module, (module: Module) => module.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  module: Module

  @ManyToMany(() => Grant, (grant: Grant) => grant.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinTable({
    name: 'rbac_role_permission_grant',
    joinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'grantId',
      referencedColumnName: 'id'
    }
  })
  grants: Grant[]

  @OneToMany(
    () => RolePermissionOption,
    (rolePermissionOption: RolePermissionOption) =>
      rolePermissionOption.rolePermission,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      eager: true
    }
  )
  roleOptions: RolePermissionOption[]
}
