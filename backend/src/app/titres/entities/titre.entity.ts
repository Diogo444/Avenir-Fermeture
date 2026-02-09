import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../../Clients/entities/client.entity";

@Entity('titres')
export class Titre
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Client, (client) => client.title)
  clients: Client[];
}
