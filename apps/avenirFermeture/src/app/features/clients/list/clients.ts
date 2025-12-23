import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { ClientsService } from '../../../services/clients.service';
import { ReferentielsService } from '../../../services/referentiels.service';
import { CommonModule } from '@angular/common';
import { Client } from '../../../models/clients.model';
import { Router } from '@angular/router';
import { NgxIntlTelInputWrapperModule } from '../../../shared/ngx-intl-tel-input-wrapper.module';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { getTitre } from '../../../models/titres.model';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators';
import { PhoneFormatPipe } from '../../../shared/utils/pipes/phone-format.pipe';





@Component({
  selector: 'app-clients',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatListModule,
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    NgxIntlTelInputWrapperModule,
    MatProgressSpinnerModule,
    PhoneFormatPipe
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  client: Client[] = [];
  displayedColumns: string[] = ['title', 'lastName', 'firstName', 'email', 'phone', 'city', 'action'];

  isLoading = true;
  message: string | null = null;

  // Filters state
  searchCtrl = new FormControl<string>('');
  titleCtrl = new FormControl<string>('');
  hasEmail = false;
  hasPhone = false;
  titles: getTitre[] = [];

  private readonly clientsService = inject(ClientsService);
  private readonly referentielsService = inject(ReferentielsService);
  private readonly router = inject(Router);
  private readonly hasEmail$ = new BehaviorSubject<boolean>(false);
  private readonly hasPhone$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    // Load filter options
    this.referentielsService.getTitres().subscribe({
      next: (titles) => (this.titles = titles),
      error: () => {},
    });

    const search$ = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value ?? ''),
      debounceTime(250),
      distinctUntilChanged(),
    );
    const title$ = this.titleCtrl.valueChanges.pipe(
      startWith(this.titleCtrl.value ?? ''),
      distinctUntilChanged(),
    );

    combineLatest([search$, title$, this.hasEmail$, this.hasPhone$])
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.message = null;
        }),
        switchMap(([q, title, hasEmail, hasPhone]) => {
          const query = (q ?? '').trim();
          const titleValue = (title ?? '').trim();
          return this.clientsService
            .getClients({
              q: query || undefined,
              title: titleValue || undefined,
              hasEmail: hasEmail || undefined,
              hasPhone: hasPhone || undefined,
              sort: 'createdAt',
              order: 'DESC',
              pageSize: 100,
            })
            .pipe(
              catchError((error) => {
                this.message = 'Une erreur est survenue lors de la récupération des clients.';
                console.error(error);
                return of([] as Client[]);
              }),
            );
        }),
      )
      .subscribe((data) => {
        this.isLoading = false;
        this.client = data;
      });
  }



  addClient(){
    this.router.navigate(['/cree-client']);
  }

  onClientClick(client: Client){
    this.router.navigate([`/one-client/${client.code_client}`]);
  }

  deleteClient(id: number){
    this.clientsService.deleteClient(id).subscribe({
      next: () => {
        this.client = this.client.filter(c => c.id !== id);
      },
      error: (error) => {
        this.message = "Une erreur est survenue lors de la suppression du client.";
        console.error(error);
      }
    });
  }

  // Toggle filters
  toggleEmailFilter() {
    this.hasEmail = !this.hasEmail;
    this.hasEmail$.next(this.hasEmail);
  }

  togglePhoneFilter() {
    this.hasPhone = !this.hasPhone;
    this.hasPhone$.next(this.hasPhone);
  }

  clearFilters() {
    this.searchCtrl.setValue('');
    this.titleCtrl.setValue('');
    this.hasEmail = false;
    this.hasPhone = false;
    this.hasEmail$.next(this.hasEmail);
    this.hasPhone$.next(this.hasPhone);
  }

}
