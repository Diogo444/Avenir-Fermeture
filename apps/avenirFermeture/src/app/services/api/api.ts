import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client } from '../../models/clients.model';
import { CreateClientDto } from '../../models/create-client.dto';
import { NumberClients } from '../../models/number_clients.model';
import { environment } from '../../../environments/environment';
import { Commercial } from '../../components/view/ajoutProduit/dto/commercial.model';
import { Produit } from '../../components/view/ajoutProduit/dto/produit.model';

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

  createCommercial(commercial: Commercial) {
    return this.http.post<Commercial>(`${this.apiurl}/commercial`, commercial);
  }
  getCommercials() {
    return this.http.get<Commercial[]>(`${this.apiurl}/commercial`);
  }

  deleteClient(id: number) {
    return this.http.delete(`${this.apiurl}/clients/${id}`);
  }

  getClientByCode(codeClient: string) {
    return this.http.get<Client>(`${this.apiurl}/clients/one-client/${codeClient}`);
  }


}
