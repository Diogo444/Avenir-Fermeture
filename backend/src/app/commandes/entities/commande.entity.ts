import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../../Clients/entities/client.entity';
import { CommandeProduit } from './commandeProduit.entity';
import { Fournisseur } from '../../fournisseurs/entities/fournisseur.entity';
import { StatutCommande, TypeAcompte } from '../commandes.types';

@Entity('commandes')
export class Commande {
  @PrimaryGeneratedColumn()
  id: number;
  // faire la relation avec l'id client
  @ManyToOne(() => Client, (client) => client.commandes)
  @JoinColumn({ name: 'client_id' })
  @Index()
  client: Client;

  @Column({ unique: true })
  reference_commande: string;

  @Column({ name: 'numero_commande', unique: true })
  numero_commande_interne: string;

  @Column({ nullable: true })
  numero_devis: string;

  @Column({ type: 'date' })
  @Index()
  date_signature: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  montant_ht: number;

  @Column('decimal', { precision: 10, scale: 2 })
  montant_ttc: number;

  @Column({
    type: 'enum',
    enum: TypeAcompte,
    default: TypeAcompte.SIGNATURE,
  })
  type_acompte: TypeAcompte;

  @Column({
    type: 'enum',
    enum: StatutCommande,
    default: StatutCommande.EN_COURS,
  })
  @Index()
  statut_commande: StatutCommande;

  @Column({ type: 'boolean', default: false })
  permis_dp: boolean;

  @ManyToOne(() => Fournisseur, (fournisseur) => fournisseur.commandes, {
    nullable: true,
  })
  @JoinColumn({ name: 'fournisseur_id' })
  fournisseur: Fournisseur | null;

  @OneToMany(
    () => CommandeProduit,
    (commandeProduit) => commandeProduit.commande,
    { cascade: true, orphanedRowAction: 'delete' }
  )
  commandesProduits: CommandeProduit[];

  @Column({ type: 'text', nullable: true })
  commentaires: string;

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
