import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../models/clients.model';
import { Api } from '../../../services/api/api';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-one-client',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
    MatListModule,
    MatTooltipModule
  ],
  templateUrl: './one-client.html',
  styleUrls: ['./one-client.css']
})
export class OneClientComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(Api);

  codeClient: string | null = this.route.snapshot.paramMap.get('code-client');
  client: Client | null = null;
  isLoading = true;

  ngOnInit(): void {
    if (this.codeClient) {
      this.api.getClientByCode(this.codeClient).subscribe(client => {
        this.client = client;
        this.isLoading = false;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatWeek(week: number): string {
    return week ? `Semaine ${week}` : 'Non défini';
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  }

  getPaymentStatus(status: boolean): string {
    return status ? 'Payé' : 'En attente';
  }

  getPaymentStatusClass(status: boolean): string {
    return status ? 'status-paid' : 'status-pending';
  }
}
