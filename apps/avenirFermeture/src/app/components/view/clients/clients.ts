import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';


import { Api } from '../../../services/api/api';
import { CommonModule } from '@angular/common';
import { Client } from '../../../models/clients.model';
import { Router } from '@angular/router';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
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
    NgxIntlTelInputModule,
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  client: Client[] = [];
  displayedColumns: string[] = ['lastName', 'firstName', 'email', 'phone', 'city', 'commercial', 'action'];

  private readonly api = inject(Api)
  private readonly router = inject(Router)

  ngOnInit(): void {
      this.api.getClients().subscribe((data) => {
        this.client = data;
      });


  }

  parseNumber(phoneNumber: string): string {
    // Example: parse and format using google-libphonenumber
      const phoneUtil = PhoneNumberUtil.getInstance();
      try {
        const parsed = phoneUtil.parse(phoneNumber, 'FR');
        return phoneUtil.format(parsed, PhoneNumberFormat.INTERNATIONAL);
      } catch (e) {
        console.error('Invalid phone number', e);
        return phoneNumber;
      }
  }

  addClient(){
    this.router.navigate(['/cree-client']);
  }

deleteClient(id: number){
  console.log(id);
  this.api.deleteClient(id).subscribe(() => {
    this.client = this.client.filter(c => c.id !== id);
  });
}

}
