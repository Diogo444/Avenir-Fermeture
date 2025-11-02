import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommandeProduit } from "../../commandes/entities/commandeProduit.entity";

@Entity('etat_produit')
export class EtatProduit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({length: 7})
  couleur_hex: string;

  @OneToMany(() => CommandeProduit, (commandeProduit) => commandeProduit.etat_produit)
  commandesProduits: CommandeProduit[];
}
