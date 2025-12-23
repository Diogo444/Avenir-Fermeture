import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { Api } from '../../../services/api/api';
import { NumberClients } from '../../../models/number_clients.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit{
  client_number: NumberClients | null = null;
  private readonly api = inject(Api)

  // Plans d'action
  weekActions = [
    { title: 'Relancer devis #D-203', status: 'todo' },
    { title: 'Planifier métrage client Dupont', status: 'done' },
    { title: 'Commander quincaillerie réf QX12', status: 'blocked' },
  ];

  overdueActions = [
    { title: 'Facture #F-118 en relance', status: 'blocked' },
    { title: 'Livraison fournisseur ALM (charnières)', status: 'todo' },
    { title: 'Validation bon à tirer #BAT-77', status: 'todo' },
  ];

  nextWeekActions = [
    { title: 'Pose chantier Martin (mardi)', status: 'todo' },
    { title: 'Ajuster planification atelier', status: 'todo' },
    { title: 'Suivi SAV fenêtre coulissante', status: 'todo' },
  ];

  // Détail de la semaine
  acompteMetres = [
    { client: 'Dupont', montant: '1 200 €', statut: 'OK' },
    { client: 'Martin', montant: '980 €', statut: 'KO' },
  ];

  acompteLivraisons = [
    { client: 'Albret', montant: '1 560 €', statut: 'OK' },
    { client: 'Lemoine', montant: '730 €', statut: 'OK' },
  ];

  soldes = [
    { client: 'SARL Durand', montant: '2 950 €', statut: 'KO' },
    { client: 'Société BatiNord', montant: '1 240 €', statut: 'OK' },
  ];

  livraisonsFournisseurs = [
    { client: 'Menuis+ (PVC)', montant: '—', statut: 'OK' },
    { client: 'Quinca ALM', montant: '—', statut: 'KO' },
  ];

  // Trésorerie & paiements (données factices)
  treasurySummary = [
    { categorie: 'Passage commande fournisseur', effectue: '6 200 €', previsionnel: '8 000 €' },
    { categorie: 'Acompte signature', effectue: '12 400 €', previsionnel: '10 800 €' },
    { categorie: 'Récurrent', effectue: '3 100 €', previsionnel: '3 100 €' },
    { categorie: 'Occasionnel', effectue: '1 450 €', previsionnel: '2 300 €' },
  ];

  ngOnInit(): void {
      this.api.getNumberClients().subscribe({
        next: (data) => {
          this.client_number = data;

        },
        error: (error) => {
          console.error('Error fetching client number:', error);
        }
      });
  }
}
