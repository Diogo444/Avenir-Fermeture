export type ClientList = Client[]

export interface Client {
  id: number
  code_client: string
  title: string | null
  firstName: string
  lastName: string
  email: string
  phone_1_label: string | null
  phone_1: string | null
  phone_2_label: string | null
  phone_2: string | null
  phone_3_label: string | null
  phone_3: string | null
  rue: string | null
  code_postal: number | null
  ville: string | null
  createdAt: string | null
  updatedAt: string | null
}


// export interface Produit {
//   id: number
//   nom: string
// }

// export interface Commerciaux {
//   id: number
//   firstName: string
//   lastName: string
// }






