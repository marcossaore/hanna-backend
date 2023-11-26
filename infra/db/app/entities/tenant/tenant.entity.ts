import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AddDateColumns } from '@infra/db/partials/add-date-columns';
import { TenantStatus } from '@/shared/enums/tenant-status.enum';

@Entity('tenant')
export class Tenant extends AddDateColumns {
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

    @Column({ type: 'enum', enum: TenantStatus, default: TenantStatus.PENDING })
    status: TenantStatus;

    @Column({ type: 'text', default: null, nullable: true })
    error?: string;
}
