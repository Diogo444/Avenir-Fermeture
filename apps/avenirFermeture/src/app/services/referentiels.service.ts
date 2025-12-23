import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Fournisseur } from '../models/fournisseur.model';
import { EtatProduit } from '../models/etat-produit.model';
import { Commercial } from '../models/commercial.model';
import { getTitre, postTitre } from '../models/titres.model';

@Injectable({
  providedIn: 'root'
})
export class ReferentielsService {
  apiurl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getFournisseurs() {
    return this.http.get<Fournisseur[]>(`${this.apiurl}/fournisseurs`);
  }

  getEtatProduits() {
    return this.http.get<EtatProduit[]>(`${this.apiurl}/etat-produit`);
  }

  createCommercial(commercial: Commercial) {
    return this.http.post<Commercial>(`${this.apiurl}/commercial`, commercial);
  }

  getCommercials() {
    return this.http.get<Commercial[]>(`${this.apiurl}/commercial`);
  }

  getTitres() {
    return this.http.get<getTitre[]>(`${this.apiurl}/titres`);
  }

  ajoutTitre(titre: postTitre) {
    return this.http.post<postTitre>(`${this.apiurl}/titres`, titre);
  }
}
