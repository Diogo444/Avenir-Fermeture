import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Commercial } from '../models/commercial.model';
import { Fournisseur } from '../models/fournisseur.model';
import { EtatProduit } from '../models/etat-produit.model';
import { getTitre, postTitre } from '../models/titres.model';
import { CreateFournisseurDto } from '../models/create-fournisseur.dto';
import { Status } from '../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class ReferentielsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private fournisseurs$?: Observable<Fournisseur[]>;
  private etatProduits$?: Observable<EtatProduit[]>;
  private titres$?: Observable<getTitre[]>;

  getFournisseurs() {
    if (!this.fournisseurs$) {
      this.fournisseurs$ = this.http.get<Fournisseur[]>(`${this.apiUrl}/fournisseurs`).pipe(
        shareReplay(1),
        catchError((error) => {
          this.fournisseurs$ = undefined;
          return throwError(() => error);
        }),
      );
    }
    return this.fournisseurs$;
  }

  createFournisseur(fournisseur: CreateFournisseurDto) {
    return this.http.post<Fournisseur>(`${this.apiUrl}/fournisseurs`, fournisseur).pipe(
      tap(() => { this.fournisseurs$ = undefined; }),
    );
  }

  getEtatProduits() {
    if (!this.etatProduits$) {
      this.etatProduits$ = this.http.get<EtatProduit[]>(`${this.apiUrl}/etat-produit`).pipe(
        shareReplay(1),
        catchError((error) => {
          this.etatProduits$ = undefined;
          return throwError(() => error);
        }),
      );
    }
    return this.etatProduits$;
  }

  createCommercial(commercial: Commercial) {
    return this.http.post<Commercial>(`${this.apiUrl}/commercial`, commercial);
  }

  getCommercials() {
    return this.http.get<Commercial[]>(`${this.apiUrl}/commercial`);
  }

  getTitres() {
    if (!this.titres$) {
      this.titres$ = this.http.get<getTitre[]>(`${this.apiUrl}/titres`).pipe(
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
    return this.http.post<postTitre>(`${this.apiUrl}/titres`, titre).pipe(
      tap(() => { this.titres$ = undefined; }),
    );
  }

  createStatus(status: Status) {
    return this.http.post<Status>(`${this.apiUrl}/status`, status);
  }

  getStatus() {
    return this.http.get<Status[]>(`${this.apiUrl}/status`);
  }
}
