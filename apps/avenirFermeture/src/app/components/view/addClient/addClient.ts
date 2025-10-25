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
import { Commercial } from '../ajoutProduit/dto/commercial.model';

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
  commercials: Commercial[] = [];
  // Expose enums to the template
  readonly CountryISO = CountryISO;

  ngOnInit(): void {
    this.initializeForm();
    this.loadProduits();
    this.loadCommercials();
  }

  initializeForm(): void {
    this.clientForm = this.fb.group({
      lastName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      codeClient: ['', [Validators.required]],
      city: ['', [Validators.required]],
      commercial: ['', [Validators.required]],
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
      const rawValue = this.clientForm.getRawValue();
      const phoneValue = rawValue.phone as string | ChangeData | null;
      let phone: string | null | undefined = undefined;
      if (phoneValue && typeof phoneValue === 'object') {
        const cd = phoneValue as ChangeData;
        phone = cd.e164Number ?? cd.internationalNumber ?? cd.number ?? null;
      } else if (typeof phoneValue === 'string') {
        phone = phoneValue || null;
      }

      const commercialId = rawValue.commercial;

      const payload: CreateClientDto = {
        code_client: rawValue.codeClient,
        lastName: rawValue.lastName,
        firstName: rawValue.firstName,
        email: rawValue.email,
        phone: phone ?? null,
        city: rawValue.city,
        produitIds: rawValue.produitIds && rawValue.produitIds.length > 0 ? rawValue.produitIds : undefined,
        commercialIds: commercialId !== null && commercialId !== undefined && commercialId !== '' ? [Number(commercialId)] : undefined,
        montant_acompte_metre: rawValue.montant_acompte_metre,
        semaine_evoi_demande_acompte_metre: rawValue.semaine_evoi_demande_acompte_metre,
        etat_paiement_acompte_metre: rawValue.etat_paiement_acompte_metre,
        note_acompte_metre: rawValue.note_acompte_metre || undefined,
        montant_acompte_livraison: rawValue.montant_acompte_livraison,
        semaine_evoi_demande_acompte_livraison: rawValue.semaine_evoi_demande_acompte_livraison,
        etat_paiement_acompte_livraison: rawValue.etat_paiement_acompte_livraison,
        note_acompte_livraison: rawValue.note_acompte_livraison || undefined,
        montant_solde: rawValue.montant_solde,
        semain_evoi_demande_solde: rawValue.semain_evoi_demande_solde,
        etat_paiement_solde: rawValue.etat_paiement_solde,
        note_solde: rawValue.note_solde || undefined,
        semain_livraison_souhaite: rawValue.semain_livraison_souhaite ?? undefined,
        livraison_limite: rawValue.livraison_limite,
      };

      console.log('Donnees du formulaire:', payload);
      this.api.createClient(payload).subscribe({
        next: () => {
          console.log('Client cree avec succes');
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          console.log(payload);
          console.error('Erreur lors de la creation du client', err);
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

  private loadCommercials(): void {
    this.api.getCommercials().subscribe({
      next: (commercials) => {
        this.commercials = commercials;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des commerciaux', err);
      }
    });
  }
}
