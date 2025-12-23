import { inject, Injectable } from '@angular/core';
import { Commercial } from '../models/commercial.model';
import { getTitre, postTitre } from '../models/titres.model';
import { Api } from './api/api';

@Injectable({
  providedIn: 'root'
})
export class ReferentielsService {
  private readonly api = inject(Api);

  getFournisseurs() {
    return this.api.getFournisseurs();
  }

  getEtatProduits() {
    return this.api.getEtatProduits();
  }

  createCommercial(commercial: Commercial) {
    return this.api.createCommercial(commercial);
  }

  getCommercials() {
    return this.api.getCommercials();
  }

  getTitres() {
    return this.api.getTitres();
  }

  ajoutTitre(titre: postTitre) {
    return this.api.ajoutTitre(titre);
  }
}
