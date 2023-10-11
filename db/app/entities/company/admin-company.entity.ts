import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { AddDateColumns } from '../../../partials/add-date-columns';
import { Company } from './company.entity';

@Entity('admin_company')
@Unique(['company.id', 'email'])
export class AdminCompany extends AddDateColumns {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @ManyToOne(() => Company, (company) => company.admins)
    company: Company;
}
