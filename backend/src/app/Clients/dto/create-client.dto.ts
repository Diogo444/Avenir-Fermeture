export interface CreateClientDto {
  code_client: string;
  lastName: string;
  firstName: string;
  email: string;
  phone?: string | null;
  city: string;
  produitIds?: number[];
  commercialIds?: number[];
  montant_acompte_metre: number;
  semaine_evoi_demande_acompte_metre: number;
  etat_paiement_acompte_metre?: boolean;
  note_acompte_metre?: string | null;
  montant_acompte_livraison: number;
  semaine_evoi_demande_acompte_livraison: number;
  etat_paiement_acompte_livraison?: boolean;
  note_acompte_livraison?: string | null;
  montant_solde: number;
  semain_evoi_demande_solde: number;
  etat_paiement_solde?: boolean;
  note_solde?: string | null;
  semain_livraison_souhaite?: number | null;
  livraison_limite: number;
}
