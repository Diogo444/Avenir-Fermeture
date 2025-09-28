import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client } from '../../models/clients.model';
import { number_client } from '../../models/number_clients.model';

@Injectable({
  providedIn: 'root'
})
export class Api {
  apiurl = 'http://localhost:3000/api';

  private readonly http = inject(HttpClient);

  getClients() {
    return this.http.get<Client[]>(`${this.apiurl}/clients`);
  }

  getNumberClients() {
    return this.http.get<number_client>(`${this.apiurl}/dashboard/number_clients`);
  }

}
