import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { CommandeProduit } from './commandeProduit.entity';
import { Fournisseur } from '../../fournisseurs/entities/fournisseur.entity';

@Entity('commandes')
export class Commande {
  @PrimaryGeneratedColumn()
  id: number;
  // faire la relation avec l'id client
  @ManyToOne(() => Client, (client) => client.commandes, { eager: true })
  client: Client;

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

  @ManyToMany(() => Fournisseur, (Fournisseur) => Fournisseur.commandes, {
    eager: true,
  })
  @JoinTable()
  fournisseurs: Fournisseur[];

  @OneToMany(
    () => CommandeProduit,
    (commandeProduit) => commandeProduit.commande,
    { cascade: true, eager: true }
  )
  commandesProduits: CommandeProduit[];

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
