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
import { Api } from '../../../services/api/api';
import { Router } from '@angular/router';
import { CreateClientDto } from '../../../models/create-client.dto';
import { Produit } from '../../../models/clients.model';
import { NgxIntlTelInputModule, CountryISO, ChangeData } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    CommonModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
  ],
  templateUrl: './addClient.html',
  styleUrl: './addClient.css',
})
export class AddClient implements OnInit {
  clientForm!: FormGroup;
  private fb = inject(FormBuilder);
  private api = inject(Api);
  private router = inject(Router);

  produits: Produit[] = [];
  // Expose enums to the template
  readonly CountryISO = CountryISO;

  ngOnInit(): void {
    this.initializeForm();
    this.loadProduits();
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
      const formData: CreateClientDto = { ...this.clientForm.value } as CreateClientDto;
      const phoneValue = this.clientForm.get('phone')?.value as string | ChangeData | null;
      if (phoneValue && typeof phoneValue === 'object') {
        const cd = phoneValue as ChangeData;
        formData.phone = cd.e164Number ?? cd.internationalNumber ?? cd.number ?? null;
      } else if (typeof phoneValue === 'string') {
        formData.phone = phoneValue || null;
      }
      console.log('Données du formulaire:', formData);
      this.api.createClient(formData).subscribe({
        next: () => {
          console.log('Client créé avec succès');
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          console.error('Erreur lors de la création du client', err);
        }
      });
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

  private loadProduits(): void {
    this.api.getProduits().subscribe({
      next: (produits) => {
        this.produits = produits;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits', err);
      }
    });
  }
}
