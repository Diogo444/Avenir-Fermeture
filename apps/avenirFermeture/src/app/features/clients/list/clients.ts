import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { Api } from '../../../../services/api/api';
import { ClientsService } from '../../../../services/clients.service';
import { ReferentielsService } from '../../../../services/referentiels.service';
import { CommonModule } from '@angular/common';
import { Client } from '../../../../models/clients.model';
import { Router } from '@angular/router';
import { NgxIntlTelInputWrapperModule } from '../../../../shared/ngx-intl-tel-input-wrapper.module';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { getTitre } from '../../../../models/titres.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PhoneFormatPipe } from '../../../../shared/utils/pipes/phone-format.pipe';





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
  private readonly router = inject(Router)

  ngOnInit(): void {
    // Load filter options
    this.referentielsService.getTitres().subscribe({
      next: (titles) => (this.titles = titles),
      error: () => {},
    });

    // Initial load
    this.loadClients();

    // Reactive search and title filter
    this.searchCtrl.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(() => {
      this.loadClients();
    });
    this.titleCtrl.valueChanges.subscribe(() => this.loadClients());
  }



  addClient(){
    this.router.navigate(['/cree-client']);
  }

  onClientClick(client: Client){
    this.router.navigate([`/one-client/${client.code_client}`]);
  }

  deleteClient(id: number){
clientsService
    this.api.deleteClient(id).subscribe({
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
    this.loadClients();
  }

  togglePhoneFilter() {
    this.hasPhone = !this.hasPhone;
    this.loadClients();
  }

  clearFilters() {
    this.searchCtrl.setValue('');
    this.titleCtrl.setValue('');
    this.hasEmail = false;
    this.hasPhone = false;
    this.loadClients();
  }

  private loadClients() {
    this.clientsServiceoading = true;
    this.api
      .getClients({
        q: this.searchCtrl.value || undefined,
        title: this.titleCtrl.value || undefined,
        hasEmail: this.hasEmail || undefined,
        hasPhone: this.hasPhone || undefined,
        sort: 'createdAt',
        order: 'DESC',
        pageSize: 100,
      })
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.client = data;
        },
        error: (error) => {
          this.isLoading = false;
          this.message = 'Une erreur est survenue lors de la récupération des clients.';
          console.error(error);
        },
      });
  }

}
