import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Produit } from '../produits/produits.entity';
import { Commercial } from '../commercial/entities/commercial.entity';
import { Affaire } from '../affaire/entities/affaire.entity';

@Entity({ name: 'clients' })
export class Client {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code_client!: string;

  @Column({ length: 150 })
  lastName!: string;

  @Column({ length: 150 })
  firstName!: string;

  @Index()
  @Column({ length: 180 })
  email!: string;

  @Column({ length: 20, nullable: true })
  phone!: string | null;

  @Column()
  rue: string;

  @Column()
  code_postal: number;

  @Column()
  ville: string;

  @OneToMany(() => Affaire, (affaire) => affaire.client)
  affaires: Affaire[];

  @ManyToMany(() => Produit, (produit) => produit.clients, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({
    name: 'clients_produits',
    joinColumn: { name: 'client_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'produit_id', referencedColumnName: 'id' },
  })
  produits!: Produit[];

  @ManyToMany(() => Commercial, (commercial) => commercial.clients, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({
    name: 'clients_commercials',
    joinColumn: { name: 'client_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'commercial_id', referencedColumnName: 'id' },
  })
  commerciaux!: Commercial[];

  @Column({ type: 'float' })
  montant_acompte_metre!: number;

  @Column()
  semaine_evoi_demande_acompte_metre!: number;

  @Column({ default: false })
  etat_paiement_acompte_metre!: boolean;

  @Column({ type: 'text', nullable: true })
  note_acompte_metre!: string | null;

  @Column({ type: 'float' })
  montant_acompte_livraison!: number;

  @Column()
  semaine_evoi_demande_acompte_livraison!: number;

  @Column({ default: false })
  etat_paiement_acompte_livraison!: boolean;

  @Column({ type: 'text', nullable: true })
  note_acompte_livraison!: string | null;

  @Column({ type: 'float' })
  montant_solde!: number;

  @Column()
  semain_evoi_demande_solde!: number;

  @Column({ default: false })
  etat_paiement_solde!: boolean;

  @Column({ type: 'text', nullable: true })
  note_solde!: string | null;

  @Column({ nullable: true })
  semain_livraison_souhaite!: number | null;

  @Column()
  livraison_limite!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
