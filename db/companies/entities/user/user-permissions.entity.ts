import { Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AddDateColumns } from '../../../partials/add-date-columns';
import { Module } from '../module/module.entity';
import { User } from './user.entity';
import { ActionModule } from '../module/action-module.entity';
import { OptionModule } from '../module/option-module.entity';

@Entity('user_permission')
export class UserPermission extends AddDateColumns {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => User, (user: User) => user.permissions)
    user: User;

    @ManyToOne(() => Module, (module: Module) => module.id)
    module: Module;

    @ManyToMany(() => ActionModule, (action: ActionModule) => action.id, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinTable({
        name: 'user_permission_action',
        joinColumn: {
            name: 'permissionId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'actionId',
            referencedColumnName: 'id',
        }
    })
    actions: ActionModule[]

    @ManyToMany(() => OptionModule, (option: OptionModule) => option.id, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinTable({
        name: 'user_permission_option',
        joinColumn: {
            name: 'permissionId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'optionId',
            referencedColumnName: 'id',
        }
    })
    options: OptionModule[]
}
