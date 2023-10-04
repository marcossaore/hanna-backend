import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AddDateColumns } from '../../_common/entity-partials/add-date-columns';

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

    @Column({ nullable: false })
    apiToken: string;

    @Column({ default: null })
    db: string;

    @Column({ default: null })
    dbUser: string;

    @Column({ default: null })
    dbPass: string;
}
