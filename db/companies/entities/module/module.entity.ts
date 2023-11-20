import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AddDateColumns } from '../../../partials/add-date-columns';
import { ActionModule } from './action-module.entity';
import { OptionModule } from './option-module.entity';

@Entity('module')
export class Module extends AddDateColumns {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    name: string;

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
