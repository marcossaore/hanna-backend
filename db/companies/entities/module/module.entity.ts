import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AddDateColumns } from '@db/partials/add-date-columns';
import { Grant } from './grant.entity';
import { Option } from './option.entity';

@Entity('rbac_module')
export class Module extends AddDateColumns {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    name: string;

    @ManyToMany(() => Grant, (grant: Grant) => grant.modules, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinTable({
        name: 'rbac_module_grants',
        joinColumn: {
          name: 'moduleId',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'grant',
          referencedColumnName: 'id',
        }
    })
    grants: Grant[];

    @ManyToMany(() => Option, (option: Option) => option.modules, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinTable({
        name: 'rbac_module_options',
        joinColumn: {
            name: 'moduleId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'option',
            referencedColumnName: 'id',
        }
    })
    options: Option[];
}
