import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('commandes')
export class Commande {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  reference_commande: string;

  @Column({ unique: true })
  numero_commande: string;

  @Column()
  numero_devis: string;

  @Column({ type: 'date' })
  date_signature: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  montant_ht: number;

  @Column('decimal', { precision: 10, scale: 2 })
  montant_ttc: number;

  @Column()
  type_acompte: string;

  @Column({ type: 'boolean', default: false })
  permis_dp: boolean;

  @Column()
  fournisseur: string; // relation future

  @Column()
  type_produit: string; // relation future

  @Column('int')
  quantite: number;

  @Column()
  etat_produit: string; // relation future

  @Column({ type: 'text', nullable: true })
  commentaires: string;

  @Column({ type: 'boolean', default: false })
  avenant: boolean;

  @Column({ type: 'date', nullable: true })
  date_metre: Date;

  @Column({ type: 'date', nullable: true })
  date_avenant: Date;

  @Column({ type: 'date', nullable: true })
  date_limite_pose: Date;

  @Column({ type: 'date', nullable: true })
  date_livraison_souhaitee: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
