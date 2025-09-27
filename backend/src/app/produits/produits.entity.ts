import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../Clients/client.entity';

@Entity({ name: 'produits' })
export class Produit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @ManyToMany(() => Client, (client) => client.produits)
  clients!: Client[];
}
