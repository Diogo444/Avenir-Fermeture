import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code_client: string;

  @Column()
  title: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone_1: string;

  @Column({ nullable: true })
  phone_2: string;

  @Column({ nullable: true })
  phone_3: string;

  @Column()
  address: string;

  @Column()
  postal_code: number;

  @Column()
  city: string;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'datetime' })
  updatedAt: Date;

}
