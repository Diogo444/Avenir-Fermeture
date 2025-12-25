import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { Client, ClientListItem } from '../../models/clients.model';
import { CreateClientDto } from '../../models/create-client.dto';
import { NumberClients } from '../../models/number_clients.model';
import { environment } from '../../../environments/environment';
import { Commercial } from '../../models/commercial.model';
import { Produit } from '../../models/produit.model';
import { getTitre, postTitre } from '../../models/titres.model';
import { Commande, CommandesListResponse } from '../../models/commandes.model';
import { CreateCommandeDto } from '../../models/create-commande.dto';
import { Fournisseur } from '../../models/fournisseur.model';
import { EtatProduit } from '../../models/etat-produit.model';
import { CreateFournisseurDto } from '../../models/create-fournisseur.dto';


@Injectable({
  providedIn: 'root'
})
export class Api {
  apiurl = environment.apiUrl;

  private readonly http = inject(HttpClient);
  private produits$?: Observable<Produit[]>;
  private fournisseurs$?: Observable<Fournisseur[]>;
  private etatProduits$?: Observable<EtatProduit[]>;
  private titres$?: Observable<getTitre[]>;

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
    include?: 'summary' | 'detail';
  }) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && `${value}` !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<ClientListItem[]>(`${this.apiurl}/clients`, { params: httpParams });
  }

  getNumberClients() {
    return this.http.get<NumberClients>(`${this.apiurl}/dashboard/number_clients`);
  }

  getProduits() {
    if (!this.produits$) {
      this.produits$ = this.http.get<Produit[]>(`${this.apiurl}/produits`).pipe(
        shareReplay(1),
        catchError((error) => {
          this.produits$ = undefined;
          return throwError(() => error);
        }),
      );
    }
    return this.produits$;
  }

  getFournisseurs() {
    if (!this.fournisseurs$) {
      this.fournisseurs$ = this.http.get<Fournisseur[]>(`${this.apiurl}/fournisseurs`).pipe(
        shareReplay(1),
        catchError((error) => {
          this.fournisseurs$ = undefined;
          return throwError(() => error);
        }),
      );
    }
    return this.fournisseurs$;
  }

  getEtatProduits() {
    if (!this.etatProduits$) {
      this.etatProduits$ = this.http.get<EtatProduit[]>(`${this.apiurl}/etat-produit`).pipe(
        shareReplay(1),
        catchError((error) => {
          this.etatProduits$ = undefined;
          return throwError(() => error);
        }),
      );
    }
    return this.etatProduits$;
  }

  ajoutProduit(produit: Produit) {
    return this.http.post<Produit>(`${this.apiurl}/produits`, produit).pipe(
      tap(() => {
        this.produits$ = undefined;
      }),
    );
  }

  createClient(client: CreateClientDto) {
    return this.http.post<Client>(`${this.apiurl}/clients`, client);
  }

  getCommandes() {
    return this.http.get<CommandesListResponse>(`${this.apiurl}/commandes`);
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
    if (!this.titres$) {
      this.titres$ = this.http.get<getTitre[]>(`${this.apiurl}/titres`).pipe(
        shareReplay(1),
        catchError((error) => {
          this.titres$ = undefined;
          return throwError(() => error);
        }),
      );
    }
    return this.titres$;
  }

  ajoutTitre(titre: postTitre) {
    return this.http.post<postTitre>(`${this.apiurl}/titres`, titre).pipe(
      tap(() => {
        this.titres$ = undefined;
      }),
    );
  }

  createFournisseur(fournisseur: CreateFournisseurDto) {
    return this.http.post<Fournisseur>(`${this.apiurl}/fournisseurs`, fournisseur).pipe(
      tap(() => {
        this.fournisseurs$ = undefined;
      }),
    );
  }

  getFournisseurById(id: number) {
    return this.http.get<Fournisseur>(`${this.apiurl}/fournisseurs/${id}`);
  }


}
