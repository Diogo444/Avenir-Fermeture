import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../../Clients/client.entity";

@Entity({ name: 'commercials' })
export class Commercial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToMany(() => Client, (client) => client.commerciaux)
  clients: Client[];

}
