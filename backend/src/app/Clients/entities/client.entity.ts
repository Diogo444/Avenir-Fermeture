import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Titre } from "../../titres/entities/titre.entity";
import { Commande } from "../../commandes/entities/commande.entity";

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code_client: string;

  @ManyToOne(() => Titre, (titre) => titre.clients)
  @JoinColumn({ name: 'title_id' })
  title: Titre;


  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone_1_label: string;

  @Column({ unique: true })
  phone_1: string;

  @Column()
  phone_2_label: string;

  @Column({ nullable: true, unique: true })
  phone_2: string;

  @Column()
  phone_3_label: string;

  @Column({ nullable: true, unique: true })
  phone_3: string;

  @Column()
  rue: string;

  @Column()
  code_postal: number;

  @Column()
  ville: string;

  @OneToMany(() => Commande, (commande) => commande.client, { cascade: true, nullable: true })
  commandes: Commande[];



  @CreateDateColumn({ type: 'datetime', name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updatedAt' })
  updatedAt: Date;

}
