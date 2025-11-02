import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Commande } from "./commande.entity";
import { Produit } from "../../produits/entities/produit.entity";
import { EtatProduit } from "../../etatProduit/entities/etat-produit.entity";

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

    @ManyToOne(() => EtatProduit, (etat) => etat.commandesProduits, { eager: true })
    etat_produit: EtatProduit;

}
