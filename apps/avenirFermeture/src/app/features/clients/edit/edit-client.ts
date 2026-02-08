import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';

import { CommonModule } from '@angular/common';
import { ClientsService } from '../../../services/clients.service';
import { ReferentielsService } from '../../../services/referentiels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateClientDto } from '../../../models/create-client.dto';

import { CountryISO, ChangeData } from 'ngx-intl-tel-input';
import { NgxIntlTelInputWrapperModule } from '../../../shared/ngx-intl-tel-input-wrapper.module';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { getTitre } from '../../../models/titres.model';
import { Client } from '../../../models/clients.model';



@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    CommonModule,
    ReactiveFormsModule,
    NgxIntlTelInputWrapperModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    FormsModule
  ],
  templateUrl: './edit-client.html',
  styleUrl: './edit-client.css',
})
export class EditClient implements OnInit {
  title: getTitre[] = [];
  clientData: Client | null = null;
  isLoading = true;


  clientForm!: FormGroup;
  private fb = inject(FormBuilder);
  private clientsService = inject(ClientsService);
  private referentielsService = inject(ReferentielsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  // Labels éditables pour les 3 champs téléphones (signal)
  phoneLabels = signal<string[]>(['Téléphone 1', 'Téléphone 2', 'Téléphone 3']);
  editingPhoneLabelIndex = -1; // -1 = aucun en édition
  public labelEditValue = '';


  // Expose enums to the template
  readonly CountryISO = CountryISO;

  durationInSeconds = 5;

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: this.durationInSeconds * 1000,
    });
  }

  getTitre() {
    this.referentielsService.getTitres().subscribe((titles) => {

      this.title = titles;
    });
  }
  getClientsByCodeClient(code_client: string) {
    this.isLoading = true;
    this.clientsService.getClientByCode(code_client).subscribe({
      next: (client) => {
        this.clientData = client;
        // Initialiser le formulaire après avoir récupéré les données
        this.initializeForm();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du client', err);
        this.isLoading = false;
        this.openSnackBar('Erreur lors de la récupération des données du client.');
        this.router.navigate(['/clients']);
      }
    });
  }




  ngOnInit(): void {
    const code_client = this.route.snapshot.paramMap.get('code-client');
    if (code_client) {
      this.getTitre();
      this.getClientsByCodeClient(code_client);
    } else {
      console.error('Aucun code client trouvé dans la route.');
      this.router.navigate(['/clients']);
    }
  }

  initializeForm(): void {
    // Mettre à jour les labels des téléphones avec les valeurs du client
    if (this.clientData) {
      this.phoneLabels.set([
        this.clientData.phone_1_label || 'Téléphone 1',
        this.clientData.phone_2_label || 'Téléphone 2',
        this.clientData.phone_3_label || 'Téléphone 3'
      ]);
    }

    const titleValue = this.clientData?.titleId ?? this.clientData?.title ?? '';
    this.clientForm = this.fb.group({
      title: [titleValue, [Validators.required]],
      lastName: [this.clientData?.lastName ?? '', [Validators.required]],
      firstName: [this.clientData?.firstName ?? '', [Validators.required]],
      email: [this.clientData?.email ?? '', [Validators.required, Validators.email]],
      phone1: [this.clientData?.phone_1 ?? '', [Validators.required]],
      phone2: [this.clientData?.phone_2 ?? ''],
      phone3: [this.clientData?.phone_3 ?? ''],
      codeClient: [this.clientData?.code_client ?? '', [Validators.required]],
      rue: [this.clientData?.rue ?? '', [Validators.required]],
      code_postal: [this.clientData?.code_postal ?? null, [Validators.required, Validators.min(0)]],
      city: [this.clientData?.ville ?? '', [Validators.required]],

    });
  }

  onSubmit(): void {
    if (this.clientForm.valid && this.clientData) {
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

      const titleValue = rawValue.title;
      const payload: CreateClientDto = {
        ...(typeof titleValue === 'number' ? { titleId: titleValue } : { title: titleValue }),
        code_client: rawValue.codeClient,
        lastName: rawValue.lastName,
        firstName: rawValue.firstName,
        email: rawValue.email,
        phone_1_label: this.phoneLabels()[0],
        phone_1: phone_1 ?? null,
        phone_2_label: this.phoneLabels()[1],
        phone_2: phone_2 ?? null,
        phone_3_label: this.phoneLabels()[2],
        phone_3: phone_3 ?? null,
        rue: rawValue.rue,
        code_postal: rawValue.code_postal,
        ville: rawValue.city,
      };



      this.clientsService.updateClient(this.clientData.code_client, payload).subscribe({
        next: () => {
          this.openSnackBar('Le client ' + rawValue.firstName + ' ' + rawValue.lastName + ' a bien été mis à jour !');
          this.router.navigate([`/one-client/${rawValue.codeClient}`]);
        },
        error: (err) => {
          this.openSnackBar("Erreur lors de la mise à jour du client " + rawValue.firstName + ' ' + rawValue.lastName + '.');
          console.error('Erreur lors de la mise à jour du client', err);
        }
      });
    } else {
      this.openSnackBar('Veuillez remplir correctement le formulaire.');

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
    // Réinitialiser avec les valeurs originales du client
    this.initializeForm();
  }


  onClose(): void {
    // naviguer à  la route précédente
    this.router.navigate([`/one-client/${this.clientData?.code_client}`]);
  }

  // Inline editing des labels téléphone
  startEditPhoneLabel(index: number): void {
    this.editingPhoneLabelIndex = index;
    this.labelEditValue = this.phoneLabels()[index] ?? '';
  }

  endEditPhoneLabel(): void {
    const idx = this.editingPhoneLabelIndex;
    if (idx >= 0) {
      const value = (this.labelEditValue ?? '').trim() || `Téléphone ${idx + 1}`;
      this.phoneLabels.update(arr => {
        const copy = arr.slice();
        copy[idx] = value;
        return copy;
      });
    }
    this.editingPhoneLabelIndex = -1;
  }

  onLabelInput(evt: Event): void {
    const target = evt.target as HTMLInputElement | null;
    this.labelEditValue = target?.value ?? '';
  }

  protected isPhoneInvalid(controlName: 'phone1' | 'phone2'): boolean {
    const control = this.clientForm?.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  protected hasPhoneValue(controlName: 'phone1' | 'phone2'): boolean {
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

}
