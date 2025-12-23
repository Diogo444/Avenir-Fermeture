import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../models/clients.model';
import { ClientsService } from '../../../services/clients.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Facture } from './components/facture/facture';
import { Commandes } from './components/commandes/commandes';
import { General } from './components/infos-general/infos/general';

@Component({
  selector: 'app-one-client',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    Facture,
    Commandes,
    General
  ],
  templateUrl: './one-client.html',
  styleUrls: ['./one-client.css']
})
export class OneClientComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientsService = inject(ClientsService);

  codeClient: string | null = this.route.snapshot.paramMap.get('code-client');
  client: Client | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.client = (data['client'] as Client | null) ?? null;
      this.isLoading = false;
    });
  }


  goBack(): void {
    this.router.navigate(['/clients']);
  }

  editClient(): void {
    if (this.codeClient) {
      this.router.navigate([`/edit-client/${this.codeClient}`]);
    }
  }

  deleteClient(): void {
    if (this.client) {
      const confirmDelete = confirm(`Êtes-vous sûr de vouloir supprimer le client ${this.client.firstName} ${this.client.lastName} ?`);
      if (confirmDelete) {
        this.clientsService.deleteClient(this.client.id).subscribe(() => {
          alert('Client supprimé avec succès.');
          this.router.navigate(['/clients']);
        });
      }
    }
  }

}
