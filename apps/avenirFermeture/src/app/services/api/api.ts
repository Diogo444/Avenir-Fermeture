import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client } from '../../models/clients.model';
import { CreateClientDto } from '../../models/create-client.dto';
import { NumberClients } from '../../models/number_clients.model';
import { environment } from '../../../environments/environment';
import { Commercial } from '../../components/view/ajoutProduit/dto/commercial.model';
import { Produit } from '../../components/view/ajoutProduit/dto/produit.model';
import { getTitre, postTitre } from '../../models/titres.model';
import { Commande } from '../../models/commandes.model';
import { CreateCommandeDto } from '../../models/create-commande.dto';
import { Fournisseur } from '../../models/fournisseur.model';
import { EtatProduit } from '../../models/etat-produit.model';


@Injectable({
  providedIn: 'root'
})
export class Api {
  apiurl = environment.apiUrl;

  private readonly http = inject(HttpClient);

  getClients(params?: {
    q?: string;
    title?: string;
    city?: string;
    code_postal?: string | number;
    hasEmail?: boolean;
    hasPhone?: boolean;
    page?: number;
    pageSize?: number;
    sort?: 'createdAt' | 'updatedAt' | 'lastName' | 'firstName';
    order?: 'ASC' | 'DESC';
  }) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && `${value}` !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<Client[]>(`${this.apiurl}/clients`, { params: httpParams });
  }

  getNumberClients() {
    return this.http.get<NumberClients>(`${this.apiurl}/dashboard/number_clients`);
  }

  getProduits() {
    return this.http.get<Produit[]>(`${this.apiurl}/produits`);
  }

  getFournisseurs() {
    return this.http.get<Fournisseur[]>(`${this.apiurl}/fournisseurs`);
  }

  getEtatProduits() {
    return this.http.get<EtatProduit[]>(`${this.apiurl}/etat-produit`);
  }

  ajoutProduit(produit: Produit) {
    return this.http.post<Produit>(`${this.apiurl}/produits`, produit);
  }

  createClient(client: CreateClientDto) {
    return this.http.post<Client>(`${this.apiurl}/clients`, client);
  }

  getCommandes() {
    return this.http.get<Commande[]>(`${this.apiurl}/commandes`);
  }

  getCommandesByClientId(clientId: number) {
    return this.http.get<Commande[]>(`${this.apiurl}/commandes/client/${clientId}`);
  }

  createCommande(commande: CreateCommandeDto) {
    return this.http.post<Commande>(`${this.apiurl}/commandes`, commande);
  }

  updateClient(codeClient: string, client: CreateClientDto) {
    return this.http.patch<Client>(`${this.apiurl}/clients/${codeClient}`, client);
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
    return this.http.get<Client>(`${this.apiurl}/clients/${codeClient}`);
  }

  getTitres() {
    return this.http.get<getTitre[]>(`${this.apiurl}/titres`);
  }

  ajoutTitre(titre: postTitre) {
    return this.http.post<postTitre>(`${this.apiurl}/titres`, titre);
  }


}
