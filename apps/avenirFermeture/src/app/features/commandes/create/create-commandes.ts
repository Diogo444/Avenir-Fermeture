import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { ProduitsService } from '../../../services/produits.service';
import { ReferentielsService } from '../../../services/referentiels.service';
import { ClientsService } from '../../../services/clients.service';
import { CommandesService } from '../../../services/commandes.service';
import { Produit } from '../../../models/produit.model';
import { Fournisseur } from '../../../models/fournisseur.model';
import { Status } from '../../../models/status.model';
import { CreateCommandeDto } from '../../../models/create-commande.dto';
import { Commande, TypeAcompte } from '../../../models/commandes.model';

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
    MatDatepickerModule,
    MatNativeDateModule,
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
  private route = inject(ActivatedRoute);
  private produitsService = inject(ProduitsService);
  private referentielsService = inject(ReferentielsService);
  private clientsService = inject(ClientsService);
  private commandesService = inject(CommandesService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  commandeForm!: FormGroup;
  produits: Produit[] = [];
  fournisseurs: Fournisseur[] = [];
  statuses: Status[] = [];
  private statusById = new Map<number, Status>();
  isLoading = true;
  isSubmitting = false;
  codeClient = '';
  clientId: number | null = null;
  commandeId: number | null = null;
  isEditMode = false;
  private loadedCommande: Commande | null = null;

  readonly today = this.startOfDay(new Date());

  readonly acompteOptions: AcompteOption[] = [
    { value: 'SIGNATURE', label: 'Signature', icon: 'edit' },
    { value: 'METRE', label: 'Métré', icon: 'straighten' },
    { value: 'LIVRAISON', label: 'Livraison', icon: 'local_shipping' },
    { value: 'POSE', label: 'Pose', icon: 'handyman' },
  ];

  ngOnInit(): void {
    const routeCodeClient = this.route.snapshot.paramMap.get('code-client');
    const routeCommandeId = this.route.snapshot.paramMap.get('commandeId');
    this.codeClient = routeCodeClient || localStorage.getItem('code_client') || '';
    this.commandeId = routeCommandeId ? Number(routeCommandeId) : null;
    this.isEditMode = this.commandeId !== null && !Number.isNaN(this.commandeId);
    this.initializeForm();
    this.resolveClientId();
    this.loadInitialData();
  }

  get produitsArray(): FormArray {
    return this.commandeForm.get('produits') as FormArray;
  }

  get totalAvenants(): number {
    return this.produitsArray.controls.filter(control => control.get('avenant')?.value).length;
  }

  get minDateSignature(): Date | null {
    if (this.isEditMode) {
      return null;
    }
    return this.today;
  }

  get minDateMetre(): Date | null {
    if (this.isEditMode) {
      return null;
    }
    return this.maxDate(this.today, this.commandeForm?.get('date_signature')?.value);
  }

  get minDateAvenant(): Date | null {
    if (this.isEditMode) {
      return null;
    }
    return this.maxDate(this.today, this.commandeForm?.get('date_signature')?.value);
  }

  get minDateLivraison(): Date | null {
    if (this.isEditMode) {
      return null;
    }
    return this.maxDate(this.today, this.commandeForm?.get('date_signature')?.value);
  }

  get minDateLimitePose(): Date | null {
    if (this.isEditMode) {
      return null;
    }
    const livraison = this.commandeForm?.get('date_livraison_souhaitee')?.value;
    const signature = this.commandeForm?.get('date_signature')?.value;
    return this.maxDate(this.today, livraison ?? signature);
  }

  getStatusColor(statusId: unknown): string {
    const id = this.normalizeOptionalId(statusId);
    return id ? this.statusById.get(id)?.color ?? '#9ca3af' : '#9ca3af';
  }

  getStatusLabel(statusId: unknown): string {
    const id = this.normalizeOptionalId(statusId);
    return id ? this.statusById.get(id)?.name ?? 'Non défini' : 'Non défini';
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

    const clientId = this.clientId ?? this.loadedCommande?.client?.id ?? this.parseStoredClientId();
    if (!clientId) {
      this.openSnackBar('Client introuvable. Rechargez la page du client.');
      return;
    }

    const raw = this.commandeForm.getRawValue();
    const dateSignature = this.toApiDate(raw.date_signature);
    if (!dateSignature) {
      this.openSnackBar('Date de signature invalide.');
      return;
    }

    const produitsFormValues = raw.produits as Array<{
      produitId: number | string;
      fournisseurId: number | string;
      quantite: number | string;
      statusId?: number | string | null;
      note?: string | null;
      avenant?: boolean;
    }>;

    const fournisseurIds = produitsFormValues
      .map(produit => this.normalizeOptionalId(produit.fournisseurId))
      .filter((id): id is number => id !== null);
    const uniqueFournisseurIds = Array.from(new Set(fournisseurIds));

    const payload: CreateCommandeDto = {
      clientId,
      reference_commande: raw.reference_commande,
      numero_commande_interne: raw.numero_commande_interne,
      numero_devis: raw.numero_devis?.trim() || null,
      date_signature: dateSignature,
      montant_ht: Number(raw.montant_ht),
      montant_ttc: Number(raw.montant_ttc),
      type_acompte: raw.type_acompte,
      permis_dp: !!raw.permis_dp,
      fournisseurId: uniqueFournisseurIds.length === 1 ? uniqueFournisseurIds[0] : null,
      commentaires: raw.commentaires?.trim() || null,
      date_metre: this.toApiDate(raw.date_metre),
      date_avenant: this.toApiDate(raw.date_avenant),
      date_limite_pose: this.toApiDate(raw.date_limite_pose),
      date_livraison_souhaitee: this.toApiDate(raw.date_livraison_souhaitee),
      produits: produitsFormValues.map(produit => ({
        produitId: Number(produit.produitId),
        fournisseurId: Number(produit.fournisseurId),
        quantite: Number(produit.quantite),
        statusId: this.normalizeOptionalId(produit.statusId),
        note: produit.note?.trim() || null,
        avenant: !!produit.avenant,
      })),
    };

    this.isSubmitting = true;
    const request$ =
      this.isEditMode && this.commandeId
        ? this.commandesService.updateCommande(this.commandeId, payload)
        : this.commandesService.createCommande(payload);

    request$
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.openSnackBar(this.isEditMode ? 'La commande a bien été modifiée.' : 'La commande a bien été créée.');
          this.router.navigate([`/one-client/${this.codeClient}`]);
        },
        error: () => {
          this.openSnackBar(this.isEditMode ? 'La commande n’a pas pu être modifiée.' : "La commande n’a pas pu être créée.");
        },
      });
  }

  onReset(): void {
    if (this.isEditMode && this.loadedCommande) {
      this.patchFormForEdit(this.loadedCommande);
      return;
    }
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
    this.commandeForm = this.fb.group(
      {
        reference_commande: ['', [Validators.required]],
        numero_devis: [''],
        numero_commande_interne: ['', [Validators.required]],
        date_signature: [null, [Validators.required, this.notBeforeTodayValidator]],
        montant_ht: [null, [Validators.required, Validators.min(0)]],
        montant_ttc: [null, [Validators.required, Validators.min(0)]],
        type_acompte: ['SIGNATURE', [Validators.required]],
        permis_dp: [false],
        commentaires: [''],
        date_metre: [null, [this.notBeforeTodayValidator]],
        date_avenant: [null, [this.notBeforeTodayValidator]],
        date_limite_pose: [null, [this.notBeforeTodayValidator]],
        date_livraison_souhaitee: [null, [this.notBeforeTodayValidator]],
        produits: this.fb.array([this.createProduitGroup()]),
      },
      {
        validators: [this.montantsConsistencyValidator, this.dateConsistencyValidator],
      },
    );
  }

  private createProduitGroup(): FormGroup {
    return this.fb.group({
      produitId: [null, [Validators.required]],
      fournisseurId: [null, [Validators.required]],
      quantite: [1, [Validators.required, Validators.min(1)]],
      statusId: [null],
      note: [''],
      avenant: [false],
    });
  }

  private loadInitialData(): void {
    this.isLoading = true;
    const selects$ = forkJoin({
      produits: this.produitsService.getProduits().pipe(catchError(() => of([] as Produit[]))),
      fournisseurs: this.referentielsService.getFournisseurs().pipe(catchError(() => of([] as Fournisseur[]))),
      statuses: this.referentielsService.getStatus().pipe(catchError(() => of([] as Status[]))),
    });

    if (this.isEditMode && this.commandeId) {
      forkJoin({
        selects: selects$,
        commande: this.commandesService.getCommandeById(this.commandeId).pipe(catchError(() => of(null))),
      })
        .pipe(finalize(() => {
          this.isLoading = false;
        }))
        .subscribe(({ selects, commande }) => {
          this.applySelects(selects.produits, selects.fournisseurs, selects.statuses);
          if (!commande) {
            this.openSnackBar('Commande introuvable.');
            this.onClose();
            return;
          }
          this.patchFormForEdit(commande);
        });
      return;
    }

    selects$
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(({ produits, fournisseurs, statuses }) => {
        this.applySelects(produits, fournisseurs, statuses);
      });
  }

  private applySelects(produits: Produit[], fournisseurs: Fournisseur[], statuses: Status[]) {
    this.produits = produits;
    this.fournisseurs = fournisseurs;
    this.statuses = statuses;
    this.statusById = new Map(
      statuses
        .filter((status): status is Status & { id: number } => typeof status.id === 'number')
        .map(status => [status.id, status]),
    );
  }

  private patchFormForEdit(commande: Commande): void {
    this.loadedCommande = commande;
    this.clientId = commande.client?.id ?? this.clientId;
    if (commande.client?.code_client) {
      this.codeClient = commande.client.code_client;
    }

    if (this.clientId) {
      localStorage.setItem('id_client', String(this.clientId));
    }
    if (this.codeClient) {
      localStorage.setItem('code_client', this.codeClient);
    }

    this.commandeForm.patchValue({
      reference_commande: commande.reference_commande ?? '',
      numero_devis: commande.numero_devis ?? '',
      numero_commande_interne: commande.numero_commande_interne ?? '',
      date_signature: this.normalizeToStartOfDayDate(commande.date_signature),
      montant_ht: commande.montant_ht ?? null,
      montant_ttc: commande.montant_ttc ?? null,
      type_acompte: commande.type_acompte ?? 'SIGNATURE',
      permis_dp: !!commande.permis_dp,
      commentaires: commande.commentaires ?? '',
      date_metre: this.normalizeToStartOfDayDate(commande.date_metre),
      date_avenant: this.normalizeToStartOfDayDate(commande.date_avenant),
      date_limite_pose: this.normalizeToStartOfDayDate(commande.date_limite_pose),
      date_livraison_souhaitee: this.normalizeToStartOfDayDate(commande.date_livraison_souhaitee),
    });

    while (this.produitsArray.length > 0) {
      this.produitsArray.removeAt(0);
    }

    const produits = commande.commandesProduits ?? [];
    if (produits.length === 0) {
      this.produitsArray.push(this.createProduitGroup());
      return;
    }

    for (const produit of produits) {
      this.produitsArray.push(
        this.fb.group({
          produitId: [produit.produit?.id ?? null, [Validators.required]],
          fournisseurId: [produit.fournisseur?.id ?? commande.fournisseur?.id ?? null, [Validators.required]],
          quantite: [produit.quantite ?? 1, [Validators.required, Validators.min(1)]],
          statusId: [produit.status?.id ?? null],
          note: [produit.note ?? ''],
          avenant: [!!produit.avenant],
        }),
      );
    }
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
    this.clientsService.getClientByCode(this.codeClient).subscribe({
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

  private readonly notBeforeTodayValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (this.isEditMode) {
      return null;
    }
    const date = this.normalizeToStartOfDayDate(control.value);
    if (!date) {
      return null;
    }
    return date < this.today ? { beforeToday: true } : null;
  };

  private readonly montantsConsistencyValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const htRaw = control.get('montant_ht')?.value;
    const ttcRaw = control.get('montant_ttc')?.value;
    if (htRaw === null || typeof htRaw === 'undefined' || ttcRaw === null || typeof ttcRaw === 'undefined') {
      return null;
    }
    const ht = Number(htRaw);
    const ttc = Number(ttcRaw);
    if (!Number.isFinite(ht) || !Number.isFinite(ttc)) {
      return null;
    }
    return ttc < ht ? { ttcLessThanHt: true } : null;
  };

  private readonly dateConsistencyValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const signature = this.normalizeToStartOfDayDate(control.get('date_signature')?.value);
    const metre = this.normalizeToStartOfDayDate(control.get('date_metre')?.value);
    const avenant = this.normalizeToStartOfDayDate(control.get('date_avenant')?.value);
    const livraison = this.normalizeToStartOfDayDate(control.get('date_livraison_souhaitee')?.value);
    const limitePose = this.normalizeToStartOfDayDate(control.get('date_limite_pose')?.value);

    const errors: ValidationErrors = {};

    if (signature && metre && metre < signature) {
      errors['metreBeforeSignature'] = true;
    }
    if (signature && avenant && avenant < signature) {
      errors['avenantBeforeSignature'] = true;
    }
    if (signature && livraison && livraison < signature) {
      errors['livraisonBeforeSignature'] = true;
    }
    if (signature && limitePose && limitePose < signature) {
      errors['limitePoseBeforeSignature'] = true;
    }
    if (livraison && limitePose && limitePose < livraison) {
      errors['limitePoseBeforeLivraison'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };

  private toApiDate(value: unknown): string | null {
    const date = this.normalizeToStartOfDayDate(value);
    if (!date) {
      return null;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private normalizeToStartOfDayDate(value: unknown): Date | null {
    if (!value) {
      return null;
    }
    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return this.startOfDay(date);
  }

  private startOfDay(value: Date): Date {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private maxDate(base: Date, candidate: unknown): Date {
    const candidateDate = this.normalizeToStartOfDayDate(candidate);
    if (!candidateDate) {
      return base;
    }
    return candidateDate > base ? candidateDate : base;
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
