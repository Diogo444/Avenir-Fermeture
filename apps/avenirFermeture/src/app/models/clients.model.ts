export type ClientList = Client[]

export interface Client {
  id: number
  code_client: string
  lastName: string
  firstName: string
  email: string
  phone: string
  city: string
  montant_acompte_metre: number
  semaine_evoi_demande_acompte_metre: number
  etat_paiement_acompte_metre: boolean
  note_acompte_metre: string
  montant_acompte_livraison: number
  semaine_evoi_demande_acompte_livraison: number
  etat_paiement_acompte_livraison: boolean
  note_acompte_livraison: string
  montant_solde: number
  semain_evoi_demande_solde: number
  etat_paiement_solde: boolean
  note_solde: string
  semain_livraison_souhaite: number
  livraison_limite: number
  createdAt: string
  updatedAt: string
  produits: Produit[]
  commerciaux: Commerciaux[]
}

export interface Produit {
  id: number
  nom: string
}

export interface Commerciaux {
  id: number
  firstName: string
  lastName: string
}
