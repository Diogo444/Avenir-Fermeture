import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Client } from '../../../../../models/clients.model';
import { Api } from '../../../../../services/api/api';
import { CommonModule, DatePipe } from '@angular/common';

import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [MatIconModule, MatCardModule, DatePipe, CommonModule],
  templateUrl: './general.html',
  styleUrls: ['./general.css'],
})
export class General implements OnInit {
  private api = inject(Api);
  client: Client = {} as Client;

  ngOnInit(): void {
    const code_client = localStorage.getItem('code_client') || '';
    this.api.getClientByCode(code_client).subscribe((client: Client) => {
      console.log(client);
      this.client = client;
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
}
