import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type PhoneForm = FormGroup<{
  label: FormControl<string>;
  value: FormControl<string>;
}>;
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
     CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './test.html',
  styleUrls: ['./test.css'],
})
export class Test {
  // inject FormBuilder before using it to build the form
  private fb = inject(FormBuilder);

  // Liste dynamique des téléphones
  form = this.fb.group({
    phones: this.fb.array<PhoneForm>([]),
  });

  get phonesFA() {
    return this.form.controls.phones;
  }

  // index du label actuellement en édition (-1 = aucun)
  editingLabelIndex = signal<number>(-1);

  constructor() {
    this.setPhones([
      { label: 'Téléphone 1', value: '' },
      { label: 'Téléphone 2', value: '' },
      { label: 'Téléphone 3', value: '' },
    ]);
  }

  setPhones(data: { label: string; value: string }[]) {
    this.phonesFA.clear();
    for (const p of data) {
      this.phonesFA.push(
        this.fb.group({
          label: this.fb.control(p.label, {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(50)],
          }),
          value: this.fb.control(p.value, {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(32)],
          }),
        })
      );
    }
  }

  startEditLabel(i: number) {
    this.editingLabelIndex.set(i);
  }

  endEditLabel() {
    this.editingLabelIndex.set(-1);
  }

  addPhone() {
    const index = this.phonesFA.length + 1;
    this.phonesFA.push(
      this.fb.group({
        label: this.fb.control(`Téléphone ${index}`, {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(50)],
        }),
        value: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(32)],
        }),
      })
    );
  }

  removePhone(i: number) {
    this.phonesFA.removeAt(i);
    if (this.editingLabelIndex() === i) this.endEditLabel();
  }

  submit() {
    console.log('Formulaire envoyé :', this.form.getRawValue());
  }}
