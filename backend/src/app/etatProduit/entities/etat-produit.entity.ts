import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('etat_produit')
export class EtatProduit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({length: 7})
  couleur_hex: string;
}
