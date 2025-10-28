import { Affaire } from '../../affaire/entities/affaire.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from '../../Clients/client.entity';

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

  @OneToMany(() => Affaire, (affaire) => affaire.metreur)
  affaires_metreur: Affaire[];
}
