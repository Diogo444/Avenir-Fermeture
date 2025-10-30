import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../models/clients.model';
import { Api } from '../../../services/api/api';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Facture } from '../../utils/one-client/facture/facture';
import { Commandes } from '../../utils/one-client/commandes/commandes';
import { General } from '../../utils/one-client/infos-general/infos/general';

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
  private api = inject(Api);

  codeClient: string | null = this.route.snapshot.paramMap.get('code-client');
  client: Client | null = null;
  isLoading = true;

  ngOnInit(): void {
    localStorage.setItem('code_client', this.codeClient || '');
    this.getClient();
  }

  getClient(): void {
    if (this.codeClient) {
      this.api.getClientByCode(this.codeClient).subscribe(client => {
        // mettre l'id dans le localstorage
        localStorage.setItem('id_client', client.id.toString());
        this.client = client;
        this.isLoading = false;
      });
    }
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
        this.api.deleteClient(this.client.id).subscribe(() => {
          alert('Client supprimé avec succès.');
          this.router.navigate(['/clients']);
        });
      }
    }
  }

}
