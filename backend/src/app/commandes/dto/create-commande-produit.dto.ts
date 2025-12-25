export class CreateCommandeProduitDto {
  produitId: number;
  fournisseurId?: number | null;
  quantite: number;
  statusId?: number | null;
  note?: string;
  avenant?: boolean;
}
