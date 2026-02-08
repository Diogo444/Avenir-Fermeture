import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Produit } from '../models/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitsService {
  apiurl = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private produits$?: Observable<Produit[]>;

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

  ajoutProduit(produit: Produit) {
    return this.http.post<Produit>(`${this.apiurl}/produits`, produit).pipe(
      tap(() => {
        this.produits$ = undefined;
      }),
    );
  }
}
