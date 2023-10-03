import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn()
  @Exclude()
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
  parterDocument: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  email: string;

  @Exclude()
  @Column()
  apiToken: string;

  @Exclude()
  @Column()
  db: string;

  @Exclude()
  @Column()
  dbUser: string;

  @Exclude()
  @Column()
  dbPass: string;
}
