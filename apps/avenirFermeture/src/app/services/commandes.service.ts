import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Commande } from '../models/commandes.model';
import { CreateCommandeDto } from '../models/create-commande.dto';

@Injectable({
  providedIn: 'root'
})
export class CommandesService {
  apiurl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getCommandes() {
    return this.http.get<Commande[]>(`${this.apiurl}/commandes`);
  }

  getCommandesByClientId(clientId: number) {
    return this.http.get<Commande[]>(`${this.apiurl}/commandes/client/${clientId}`);
  }

  createCommande(commande: CreateCommandeDto) {
    return this.http.post<Commande>(`${this.apiurl}/commandes`, commande);
  }
}
