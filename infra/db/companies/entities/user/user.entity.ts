import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AddDateColumns } from '@infra/db/partials/add-date-columns';
import { Role } from '../module/role.entity';

@Entity('user')
export class User extends AddDateColumns {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ nullable: false, unique: true })
    uuid: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: true })
    phone?: string;

    @ManyToOne(() => Role, (role: Role) => role.user, {
        cascade: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    role: Role;
}
