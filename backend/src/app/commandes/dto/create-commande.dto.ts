import { StatutCommande, TypeAcompte } from '../commandes.types';
import { CreateCommandeProduitDto } from './create-commande-produit.dto';

export class CreateCommandeDto {
  clientId: number;
  reference_commande: string;
  numero_commande_interne: string;
  numero_devis?: string;
  date_signature: string;
  montant_ht: number;
  montant_ttc: number;
  type_acompte: TypeAcompte;
  statut_commande?: StatutCommande;
  permis_dp?: boolean;
  fournisseurId?: number | null;
  commentaires?: string;
  date_metre?: string;
  date_avenant?: string;
  date_limite_pose?: string;
  date_livraison_souhaitee?: string;
  produits?: CreateCommandeProduitDto[];
}
