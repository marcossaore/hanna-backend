import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AddDateColumns } from '../../_common/entity-partials/add-date-columns';

@Entity('admin_company')
export class AdminCompany extends AddDateColumns {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    companyId: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    document: string;

    @Column({ nullable: false })
    email: string;
}
