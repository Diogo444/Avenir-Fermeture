import { StatutCommande, TypeAcompte } from './commandes.model';

export interface CreateCommandeProduitDto {
  produitId: number;
  fournisseurId: number;
  quantite: number;
  statusId?: number | null;
  note?: string | null;
  avenant?: boolean;
}

export interface CreateCommandeDto {
  clientId: number;
  reference_commande: string;
  numero_commande_interne: string;
  numero_devis?: string | null;
  date_signature: string;
  montant_ht: number;
  montant_ttc: number;
  type_acompte: TypeAcompte;
  statut_commande?: StatutCommande;
  permis_dp?: boolean;
  fournisseurId?: number | null;
  commentaires?: string | null;
  date_metre?: string | null;
  date_avenant?: string | null;
  date_limite_pose?: string | null;
  date_livraison_souhaitee?: string | null;
  produits?: CreateCommandeProduitDto[];
}
