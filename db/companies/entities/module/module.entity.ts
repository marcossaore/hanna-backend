import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { AddDateColumns } from '../../../partials/add-date-columns';
import { ActionModule } from './action-module.entity';
import { OptionModule } from './option-module.entity';

@Entity('module')
@Tree('closure-table')
export class Module extends AddDateColumns {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    name: string;

    @TreeChildren()
    children: Module[];
  
    @TreeParent()
    parent: Module;

    @ManyToMany(() => ActionModule, (action: ActionModule) => action.modules, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinTable({
        name: 'module_actions',
        joinColumn: {
          name: 'moduleId',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'action',
          referencedColumnName: 'id',
        }
    })
    actions: ActionModule[];

    @ManyToMany(() => OptionModule, (option: OptionModule) => option.modules, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinTable({
        name: 'module_options',
        joinColumn: {
            name: 'moduleId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'option',
            referencedColumnName: 'id',
        }
    })
    options: OptionModule[];
}
