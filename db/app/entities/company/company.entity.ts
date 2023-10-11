import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyStatus } from '../../../../src/_common/enums/company-status.enum';
import { AddDateColumns } from '../../../partials/add-date-columns';
import { AdminCompany } from './admin-company.entity';

@Entity('company')
export class Company extends AddDateColumns {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    uuid: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, length: 30, unique: true})
    companyIdentifier: string;

    @Column({ nullable: false, unique: true })
    document: string;

    @Column({ nullable: false })
    partnerName: string;

    @Column({ nullable: false })
    partnerDocument: string;

    @Column({ nullable: false })
    phone: string;

    @Column({ nullable: false })
    email: string;

    @Column({ type: 'enum', enum: CompanyStatus, default: CompanyStatus.PENDING })
    status: CompanyStatus;

    @OneToMany(() => AdminCompany, (adminCompany: AdminCompany) => adminCompany.company, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    admins: AdminCompany[];
    
    @Column({ type: 'text', default: null, nullable: true })
    error?: string;
}
