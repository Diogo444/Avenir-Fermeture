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

import { NgxIntlTelInputModule, CountryISO, ChangeData } from 'ngx-intl-tel-input';
import { Commercial } from '../ajoutProduit/dto/commercial.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './addClient.html',
  styleUrls: ['./addClient.css'],
})
export class AddClient implements OnInit {
  clientForm!: FormGroup;
  private fb = inject(FormBuilder);
  private api = inject(Api);
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);


  commercials: Commercial[] = [];
  // Expose enums to the template
  readonly CountryISO = CountryISO;
  protected phoneFocusState: Record<'phone1' | 'phone2' | 'phone3', boolean> = {
    phone1: false,
    phone2: false,
    phone3: false,
  };

  durationInSeconds = 5;

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: this.durationInSeconds * 1000,
    });
  }

  ngOnInit(): void {
    console.log('AddClient component initialized');
    this.initializeForm();
    console.log('Client form created:', this.clientForm);
  }

  initializeForm(): void {
    this.clientForm = this.fb.group({
      lastName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone1: [''],
      phone2: [''],
      phone3: [''],
      codeClient: ['', [Validators.required]],
      rue: ['', [Validators.required]],
      code_postal: [null, [Validators.required, Validators.min(0)]],
      city: ['', [Validators.required]],

    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const rawValue = this.clientForm.getRawValue();
      const parsePhone = (val: string | ChangeData | null | undefined): string | null => {
        if (!val) return null;
        if (typeof val === 'string') return val || null;
        const cd = val as ChangeData;
        return cd.e164Number ?? cd.internationalNumber ?? cd.number ?? null;
      };

      const phone_1 = parsePhone(rawValue.phone1);
      const phone_2 = parsePhone(rawValue.phone2);
      const phone_3 = parsePhone(rawValue.phone3);

      const commercialId = rawValue.commercial;

      const payload: CreateClientDto = {
        code_client: rawValue.codeClient,
        lastName: rawValue.lastName,
        firstName: rawValue.firstName,
        email: rawValue.email,
        phone: phone_1 ?? null,
        phone_1: phone_1 ?? null,
        phone_2: phone_2 ?? null,
        phone_3: phone_3 ?? null,
        rue: rawValue.rue,
        code_postal: rawValue.code_postal,
        ville: rawValue.city,
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

      this.api.createClient(payload).subscribe({
        next: () => {
          this.openSnackBar('Le client ' + rawValue.firstName + ' ' + rawValue.lastName + ' a bien été ajouté !');
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          this.openSnackBar("Erreur lors de l'ajout du client " + rawValue.firstName + ' ' + rawValue.lastName + '.');
          console.error('Erreur lors de la creation du client', err);

          console.error('Erreur lors de la creation du client', err);
        }
      });
    } else {
      this.openSnackBar('Veuillez remplir correctement le formulaire.');
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


  onClose(): void {
    this.router.navigate(['/clients']);
  }

  protected isPhoneInvalid(controlName: 'phone1' | 'phone2' | 'phone3'): boolean {
    const control = this.clientForm?.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  protected hasPhoneValue(controlName: 'phone1' | 'phone2' | 'phone3'): boolean {
    const control = this.clientForm?.get(controlName);
    if (!control) {
      return false;
    }

    const value = control.value as string | ChangeData | null | undefined;

    if (!value) {
      return false;
    }

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    const changeData = value as ChangeData;
    return !!(
      changeData?.e164Number ||
      changeData?.internationalNumber ||
      changeData?.number ||
      changeData?.dialCode
    );
  }

  protected onPhoneFocus(controlName: 'phone1' | 'phone2' | 'phone3'): void {
    this.phoneFocusState[controlName] = true;
  }

  protected onPhoneBlur(controlName: 'phone1' | 'phone2' | 'phone3'): void {
    this.phoneFocusState[controlName] = false;
    const control = this.clientForm?.get(controlName);
    control?.markAsTouched();
  }

  protected isPhoneFocused(controlName: 'phone1' | 'phone2' | 'phone3'): boolean {
    return this.phoneFocusState[controlName];
  }
}
