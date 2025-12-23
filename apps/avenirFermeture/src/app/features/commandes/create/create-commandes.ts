import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Api } from '../../../services/api/api';
import { Produit } from '../../../models/produit.model';
import { Fournisseur } from '../../../models/fournisseur.model';
import { EtatProduit } from '../../../models/etat-produit.model';
import { CreateCommandeDto } from '../../../models/create-commande.dto';
import { TypeAcompte } from '../../../models/commandes.model';

interface AcompteOption {
  value: TypeAcompte;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-create-commandes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './create-commandes.html',
  styleUrl: './create-commandes.css',
})
export class CreateCommandes implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(Api);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  commandeForm!: FormGroup;
  produits: Produit[] = [];
  fournisseurs: Fournisseur[] = [];
  etatsProduits: EtatProduit[] = [];
  isLoading = true;
  isSubmitting = false;
  codeClient = '';
  clientId: number | null = null;

  readonly acompteOptions: AcompteOption[] = [
    { value: 'SIGNATURE', label: 'Signature', icon: 'edit' },
    { value: 'METRE', label: 'Métré', icon: 'straighten' },
    { value: 'LIVRAISON', label: 'Livraison', icon: 'local_shipping' },
    { value: 'POSE', label: 'Pose', icon: 'handyman' },
  ];

  ngOnInit(): void {
    this.codeClient = localStorage.getItem('code_client') || '';
    this.initializeForm();
    this.resolveClientId();
    this.loadSelects();
  }

  get produitsArray(): FormArray {
    return this.commandeForm.get('produits') as FormArray;
  }

  get totalAvenants(): number {
    return this.produitsArray.controls.filter(control => control.get('avenant')?.value).length;
  }

  addProduit(): void {
    this.produitsArray.push(this.createProduitGroup());
  }

  removeProduit(index: number): void {
    if (this.produitsArray.length > 1) {
      this.produitsArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.commandeForm.invalid) {
      this.markFormGroupTouched();
      this.openSnackBar('Veuillez compléter les champs obligatoires.');
      return;
    }

    const clientId = this.clientId ?? this.parseStoredClientId();
    if (!clientId) {
      this.openSnackBar('Client introuvable. Rechargez la page du client.');
      return;
    }

    const raw = this.commandeForm.getRawValue();
    const produitsFormValues = raw.produits as Array<{
      produitId: number | string;
      quantite: number | string;
      etatProduitId?: number | string | null;
      note?: string | null;
      avenant?: boolean;
    }>;

    const payload: CreateCommandeDto = {
      clientId,
      reference_commande: raw.reference_commande,
      numero_commande_interne: raw.numero_commande_interne,
      numero_devis: raw.numero_devis?.trim() || null,
      date_signature: raw.date_signature,
      montant_ht: Number(raw.montant_ht),
      montant_ttc: Number(raw.montant_ttc),
      type_acompte: raw.type_acompte,
      permis_dp: !!raw.permis_dp,
      fournisseurId: this.normalizeOptionalId(raw.fournisseurId),
      commentaires: raw.commentaires?.trim() || null,
      date_metre: raw.date_metre || null,
      date_avenant: raw.date_avenant || null,
      date_limite_pose: raw.date_limite_pose || null,
      date_livraison_souhaitee: raw.date_livraison_souhaitee || null,
      produits: produitsFormValues.map(produit => ({
        produitId: Number(produit.produitId),
        quantite: Number(produit.quantite),
        etatProduitId: this.normalizeOptionalId(produit.etatProduitId),
        note: produit.note?.trim() || null,
        avenant: !!produit.avenant,
      })),
    };

    this.isSubmitting = true;
    this.api.createCommande(payload).subscribe({
      next: () => {
        this.openSnackBar('Commande créée avec succès.');
        this.router.navigate([`/one-client/${this.codeClient}`]);
      },
      error: () => {
        this.openSnackBar("Erreur lors de la création de la commande.");
        this.isSubmitting = false;
      },
    });
  }

  onReset(): void {
    this.commandeForm.reset({
      type_acompte: 'SIGNATURE',
      permis_dp: false,
    });
    while (this.produitsArray.length > 0) {
      this.produitsArray.removeAt(0);
    }
    this.produitsArray.push(this.createProduitGroup());
  }

  onClose(): void {
    if (this.codeClient) {
      this.router.navigate([`/one-client/${this.codeClient}`]);
    } else {
      this.router.navigate(['/clients']);
    }
  }

  private initializeForm(): void {
    this.commandeForm = this.fb.group({
      reference_commande: ['', [Validators.required]],
      numero_devis: [''],
      numero_commande_interne: ['', [Validators.required]],
      date_signature: ['', [Validators.required]],
      montant_ht: [null, [Validators.required, Validators.min(0)]],
      montant_ttc: [null, [Validators.required, Validators.min(0)]],
      type_acompte: ['SIGNATURE', [Validators.required]],
      permis_dp: [false],
      fournisseurId: [null],
      commentaires: [''],
      date_metre: [null],
      date_avenant: [null],
      date_limite_pose: [null],
      date_livraison_souhaitee: [null],
      produits: this.fb.array([this.createProduitGroup()]),
    });
  }

  private createProduitGroup(): FormGroup {
    return this.fb.group({
      produitId: [null, [Validators.required]],
      quantite: [1, [Validators.required, Validators.min(1)]],
      etatProduitId: [null],
      note: [''],
      avenant: [false],
    });
  }

  private loadSelects(): void {
    this.isLoading = true;
    forkJoin({
      produits: this.api.getProduits().pipe(catchError(() => of([] as Produit[]))),
      fournisseurs: this.api.getFournisseurs().pipe(catchError(() => of([] as Fournisseur[]))),
      etatsProduits: this.api.getEtatProduits().pipe(catchError(() => of([] as EtatProduit[]))),
    })
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(({ produits, fournisseurs, etatsProduits }) => {
        this.produits = produits;
        this.fournisseurs = fournisseurs;
        this.etatsProduits = etatsProduits;
      });
  }

  private resolveClientId(): void {
    const storedId = this.parseStoredClientId();
    if (storedId) {
      this.clientId = storedId;
      return;
    }
    if (!this.codeClient) {
      return;
    }
    this.api.getClientByCode(this.codeClient).subscribe({
      next: client => {
        this.clientId = client.id;
      },
    });
  }

  private parseStoredClientId(): number | null {
    const storedId = localStorage.getItem('id_client');
    if (!storedId) {
      return null;
    }
    const parsed = Number(storedId);
    return Number.isNaN(parsed) ? null : parsed;
  }

  private normalizeOptionalId(value: unknown): number | null {
    if (value === null || typeof value === 'undefined' || value === '') {
      return null;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  private markFormGroupTouched(): void {
    Object.values(this.commandeForm.controls).forEach(control => {
      if (control instanceof FormArray) {
        control.controls.forEach(child => child.markAllAsTouched());
      } else {
        control.markAsTouched();
      }
    });
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 4000,
    });
  }
}
