import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Commande } from './commande.entity';
import { Produit } from '../../produits/entities/produit.entity';
import { Fournisseur } from '../../fournisseurs/entities/fournisseur.entity';
import { Status } from '../../status/entities/status.entity';

@Entity('commande_produits')
export class CommandeProduit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Commande, (commande) => commande.commandesProduits, { onDelete: 'CASCADE' })
  commande: Commande;

  @ManyToOne(() => Produit, (produit) => produit.commandesProduits)
  produit: Produit;

  @Column('int')
  quantite: number;

  @ManyToOne(() => Status, { nullable: true })
  @JoinColumn({ name: 'status_id' })
  status: Status | null;

  @ManyToOne(() => Fournisseur, { nullable: true })
  @JoinColumn({ name: 'fournisseur_id' })
  fournisseur: Fournisseur | null;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'boolean', default: false })
  avenant: boolean;

}
