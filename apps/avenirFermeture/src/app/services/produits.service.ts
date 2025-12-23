import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Produit } from '../models/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitsService {
  apiurl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getProduits() {
    return this.http.get<Produit[]>(`${this.apiurl}/produits`);
  }

  ajoutProduit(produit: Produit) {
    return this.http.post<Produit>(`${this.apiurl}/produits`, produit);
  }
}
