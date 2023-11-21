import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AddDateColumns } from '@db/partials/add-date-columns';
import { User } from '../user/user.entity';
import { RolePermission } from './role-permission.entity';

@Entity('rbac_role')
export class Role extends AddDateColumns {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    name: string;

    @OneToMany(() => RolePermission, (rolePermission: RolePermission) => rolePermission.role, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    permissions: RolePermission[];

    @OneToMany(() => User, (user: User) => user.role)
    user: User;
}
