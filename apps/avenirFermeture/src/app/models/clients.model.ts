export interface Client {
  id: number
  lastName: string
  firstName: string
  email: string
  phone: string
  montant_acompte_metre: number
  semaine_evoi_demande_acompte_metre: number
  etat_paiement_acompte_metre: boolean
  note_acompte_metre: string
  montant_acompte_livraison: number
  semaine_evoi_demande_acompte_livraison: number
  etat_paiement_acompte_livraison: boolean
  note_acompte_livraison: any
  montant_solde: number
  semain_evoi_demande_solde: number
  etat_paiement_solde: boolean
  note_solde: string
  semain_livraison_souhaite: number
  livraison_limite: number
  createdAt: string
  updatedAt: string
  produits: Produit[]
}

export interface Produit {
  id: number
  nom: string
}
