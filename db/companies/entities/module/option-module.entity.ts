import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AddDateColumns } from '../../../partials/add-date-columns';
import { Module } from './module.entity';

@Entity('option_module')
export class OptionModule extends AddDateColumns {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    name: string;

    @ManyToMany(() => Module, module => module.actions)
    modules: Module[];
}
