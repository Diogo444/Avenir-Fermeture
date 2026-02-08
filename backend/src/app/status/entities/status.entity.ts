import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('status')
export class Status {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ default: '#FFFFFF' })
    color: string;
}
