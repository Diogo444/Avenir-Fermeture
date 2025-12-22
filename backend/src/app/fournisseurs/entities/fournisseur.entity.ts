import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Commande } from '../../commandes/entities/commande.entity';

@Entity('fournisseurs')
export class Fournisseur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @OneToMany(() => Commande, (commande) => commande.fournisseur)
  commandes: Commande[];

}
