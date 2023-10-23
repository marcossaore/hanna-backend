import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AddDateColumns } from '../../../partials/add-date-columns';
import { UserPermission } from './user-permissions.entity';

@Entity('user')
export class User extends AddDateColumns {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ nullable: false, unique: true })
    uuid: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: true })
    phone?: string;

    @OneToMany(() => UserPermission, (userPermission: UserPermission) => userPermission.user, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    permissions: UserPermission[];
}
