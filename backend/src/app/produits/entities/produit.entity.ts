import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Produit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

}
