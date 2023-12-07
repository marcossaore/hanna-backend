import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { AddDateColumns } from '@infra/db/partials/add-date-columns'
import { Option } from './option.entity'
import { RolePermission } from './role-permission.entity'

@Entity('rbac_role_permission_option')
export class RolePermissionOption extends AddDateColumns {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => RolePermission,
    (rolePermission: RolePermission) => rolePermission.id
  )
  rolePermission: RolePermission

  @OneToOne(() => Option)
  @JoinColumn()
  option: Option

  @Column({ default: false })
  isActive: boolean
}
