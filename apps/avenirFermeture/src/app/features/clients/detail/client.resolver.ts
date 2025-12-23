import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Client } from '../../../models/clients.model';
import { ClientsService } from '../../../services/clients.service';

export const clientResolver: ResolveFn<Client | null> = (route) => {
  const codeClient = route.paramMap.get('code-client');
  if (!codeClient) {
    return of(null);
  }
  return inject(ClientsService).getClientByCode(codeClient).pipe(
    catchError(() => of(null)),
  );
};
