import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Client } from '../models/clients.model';
import { CreateClientDto } from '../models/create-client.dto';
import { NumberClients } from '../models/number_clients.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
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

  createClient(client: CreateClientDto) {
    return this.http.post<Client>(`${this.apiurl}/clients`, client);
  }

  updateClient(codeClient: string, client: CreateClientDto) {
    return this.http.patch<Client>(`${this.apiurl}/clients/${codeClient}`, client);
  }

  deleteClient(id: number) {
    return this.http.delete(`${this.apiurl}/clients/${id}`);
  }

  getClientByCode(codeClient: string) {
    return this.http.get<Client>(`${this.apiurl}/clients/${codeClient}`);
  }
}
