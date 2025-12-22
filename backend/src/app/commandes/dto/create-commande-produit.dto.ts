export class CreateCommandeProduitDto {
  produitId: number;
  quantite: number;
  etatProduitId?: number;
  note?: string;
  avenant?: boolean;
}
