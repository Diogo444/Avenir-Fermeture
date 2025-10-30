import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { Api } from '../../../services/api/api';
import { CommonModule } from '@angular/common';
import { Client } from '../../../models/clients.model';
import { Router } from '@angular/router';
import { NgxIntlTelInputWrapperModule } from '../../../shared/ngx-intl-tel-input-wrapper.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';





@Component({
  selector: 'app-clients',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    NgxIntlTelInputWrapperModule,
    MatProgressSpinnerModule

  ],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  client: Client[] = [];
  displayedColumns: string[] = ['title', 'lastName', 'firstName', 'email', 'phone', 'city', 'action'];

  isLoading = true;
  message: string | null = null;

  private readonly api = inject(Api)
  private readonly router = inject(Router)

  ngOnInit(): void {
      this.api.getClients().subscribe({
        next: (data) => {
          this.isLoading = false;
          this.client = data;
        },
        error: (error) => {
          this.isLoading = false;
          this.message = "Une erreur est survenue lors de la récupération des clients.";
          console.error(error);
        }
      });


  }

  parseNumber(phoneNumber: string): string {
    // Example: parse and format using google-libphonenumber
      const phoneUtil = PhoneNumberUtil.getInstance();
      try {
        const parsed = phoneUtil.parse(phoneNumber);
        return phoneUtil.format(parsed, PhoneNumberFormat.INTERNATIONAL);
      } catch (e) {
        console.error('Invalid phone number', e);
        return phoneNumber;
      }
  }

  addClient(){
    this.router.navigate(['/cree-client']);
  }

  onClientClick(client: Client){
    this.router.navigate([`/one-client/${client.code_client}`]);
  }

  deleteClient(id: number){
    console.log(id);
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

}
