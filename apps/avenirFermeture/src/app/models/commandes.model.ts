import { Client } from './clients.model';
import { EtatProduit } from './etat-produit.model';
import { Fournisseur } from './fournisseur.model';
import { Produit } from '../components/view/ajoutProduit/dto/produit.model';

export type StatutCommande = 'EN_COURS' | 'TERMINEE' | 'ANNULEE';
export type TypeAcompte = 'SIGNATURE' | 'METRE' | 'LIVRAISON' | 'POSE';

export interface CommandeProduit {
  id: number;
  quantite: number;
  note: string | null;
  avenant: boolean;
  produit: Produit;
  etat_produit: EtatProduit | null;
}

export interface Commande {
  id: number;
  client: Client;
  reference_commande: string;
  numero_commande_interne: string;
  numero_devis: string | null;
  date_signature: string;
  montant_ht: number;
  montant_ttc: number;
  type_acompte: TypeAcompte;
  statut_commande: StatutCommande;
  permis_dp: boolean;
  fournisseur: Fournisseur | null;
  commandesProduits: CommandeProduit[];
  commentaires: string | null;
  date_metre: string | null;
  date_avenant: string | null;
  date_limite_pose: string | null;
  date_livraison_souhaitee: string | null;
  created_at: string;
  updated_at: string;
}
