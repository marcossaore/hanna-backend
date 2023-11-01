import { AddDateColumns } from "../../../../db/partials/add-date-columns";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('customer')
export class Customer extends AddDateColumns {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    uuid: string;

    @Column({ nullable: false })
    phone: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: false })
    street: string;

    @Column({ nullable: false })
    number: string;

    @Column({ nullable: false })
    complement?: string;

    @Column({ nullable: false })
    neighborhood: string;

    @Column({ nullable: false })
    city: string;

    @Column({ nullable: false })
    state: string;

    @Column({ nullable: false })
    country: string;
}

