import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

export interface CreateClientDto {
  lastName: string;
  firstName: string;
  email: string;
  phone?: string | null;
  produitIds?: number[];
  montant_acompte_metre: number;
  semaine_evoi_demande_acompte_metre: number;
  etat_paiement_acompte_metre?: boolean;
  note_acompte_metre?: string | null;
  montant_acompte_livraison: number;
  semaine_evoi_demande_acompte_livraison: number;
  etat_paiement_acompte_livraison?: boolean;
  note_acompte_livraison?: string | null;
  montant_solde: number;
  semain_evoi_demande_solde: number;
  etat_paiement_solde?: boolean;
  note_solde?: string | null;
  semain_livraison_souhaite?: number | null;
  livraison_limite: number;
}

@Component({
  selector: 'app-add-client',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './addClient.html',
  styleUrl: './addClient.css',
})
export class AddClient implements OnInit {
  clientForm!: FormGroup;
  private fb = inject(FormBuilder);

  // Liste des produits (à adapter selon vos données)
  produits = [
    { id: 1, name: 'Fenêtre PVC' },
    { id: 2, name: 'Porte d\'entrée' },
    { id: 3, name: 'Volet roulant' },
    { id: 4, name: 'Porte-fenêtre' },
    { id: 5, name: 'Fenêtre aluminium' }
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.clientForm = this.fb.group({
      lastName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      produitIds: [[]],
      montant_acompte_metre: [0, [Validators.required, Validators.min(0)]],
      semaine_evoi_demande_acompte_metre: [0, [Validators.required, Validators.min(0)]],
      etat_paiement_acompte_metre: [false],
      note_acompte_metre: [''],
      montant_acompte_livraison: [0, [Validators.required, Validators.min(0)]],
      semaine_evoi_demande_acompte_livraison: [0, [Validators.required, Validators.min(0)]],
      etat_paiement_acompte_livraison: [false],
      note_acompte_livraison: [''],
      montant_solde: [0, [Validators.required, Validators.min(0)]],
      semain_evoi_demande_solde: [0, [Validators.required, Validators.min(0)]],
      etat_paiement_solde: [false],
      note_solde: [''],
      semain_livraison_souhaite: [null],
      livraison_limite: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const formData: CreateClientDto = this.clientForm.value;
      console.log('Données du formulaire:', formData);
      // Ici vous pouvez appeler votre service pour envoyer les données
    } else {
      console.log('Formulaire invalide');
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.clientForm.controls).forEach(key => {
      const control = this.clientForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  onReset(): void {
    this.clientForm.reset();
    this.initializeForm();
  }
}
