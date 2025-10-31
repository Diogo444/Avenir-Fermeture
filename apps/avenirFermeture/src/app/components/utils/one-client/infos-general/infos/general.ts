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

  parseNumber(phoneNumber: string | null | undefined): string {
    const phoneUtil = PhoneNumberUtil.getInstance();

    // Guard: handle empty, null, undefined, or whitespace-only values
    if (phoneNumber == null) {
      return 'Non renseigné';
    }

    const input = String(phoneNumber).trim();
    if (!input) {
      return 'Non renseigné';
    }

    try {
      // If no leading "+", assume French numbers by default
      const parsed = input.startsWith('+')
        ? phoneUtil.parse(input)
        : phoneUtil.parse(input, 'FR');

      if (!phoneUtil.isValidNumber(parsed)) {
        return input; // return as-is if invalid rather than throwing/logging
      }

      return phoneUtil.format(parsed, PhoneNumberFormat.INTERNATIONAL);
    } catch {
      // Silently fall back to raw input to avoid noisy console errors
      return input;
    }
  }
}
