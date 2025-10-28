import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'affaires' })
export class Affaire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  date_signature: Date | null;

  @Column({ type: 'date', nullable: true })
  date_metre: Date | null;

  @Column({ type: 'date', nullable: true })
  date_livraison_souhaitee: Date | null;

  @Column({ type: 'date', nullable: true })
  date_limite_pose: Date | null;

  @Column({ type: 'float', default: 0 })
  montant_vendu: number;

  @Column({ type: 'float', default: 0 })
  acompte_signature: number;

  @Column({ type: 'float', default: 0 })
  acompte_metre: number;

  @Column({ type: 'float', default: 0 })
  acompte_livraison: number;

  @Column({ type: 'float', default: 0 })
  acompte_pose: number;

  @Column({ type: 'simple-array', nullable: true })
  achats_fournisseurs: number[];

  @Column()
  etat_commande: string;

  @Column({ type: 'simple-array', nullable: true })
  etats_livraison_produits: string[];

  @Column()
  emplacement_dossier: string;


  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

