import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client, Produit } from '../../models/clients.model';
import { CreateClientDto } from '../../models/create-client.dto';
import { NumberClients } from '../../models/number_clients.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Api {
  apiurl = environment.apiUrl;

  private readonly http = inject(HttpClient);

  getClients() {
    return this.http.get<Client[]>(`${this.apiurl}/clients`);
  }

  getNumberClients() {
    return this.http.get<NumberClients>(`${this.apiurl}/dashboard/number_clients`);
  }

  getProduits() {
    return this.http.get<Produit[]>(`${this.apiurl}/produits`);
  }

  ajoutProduit(produit: Produit) {
    return this.http.post<Produit>(`${this.apiurl}/produits`, produit);
  }

  createClient(client: CreateClientDto) {
    return this.http.post<Client>(`${this.apiurl}/clients/create`, client);
  }


}
