import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Commande } from "../../commandes/entities/commande.entity";

@Entity('fournisseurs')
export class Fournisseur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @ManyToMany(() => Commande, Commande => Commande.fournisseurs)
  commandes: Commande[];

}
