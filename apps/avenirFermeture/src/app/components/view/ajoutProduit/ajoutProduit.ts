import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Api } from '../../../services/api/api';
import { Produit } from '../../../models/produit.model';
import { CommonModule } from '@angular/common';
import { Commercial } from '../../../models/commercial.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getTitre } from '../../../models/titres.model';

@Component({
  selector: 'app-ajout-produit',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './ajoutProduit.html',
  styleUrl: './ajoutProduit.css',
})
export class AjoutProduit implements OnInit {
  produitName = '';
  produits: Produit[] = [];
  commercial: Commercial[] = [];
  titres: getTitre[] = [];
  titreName = '';

  commercialLastName = '';
  commercialFirstName = '';

  private readonly api = inject(Api);
  private _snackBar = inject(MatSnackBar);

  durationInSeconds = 5;

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: this.durationInSeconds * 1000,
    });
  }

  onSubmitProduit() {
    this.api.ajoutProduit({ nom: this.produitName } as Produit).subscribe({
      next: () => {
        this.openSnackBar(
          'Le produit ' + this.produitName + ' a bien été ajouté !'
        );
        this.getProduit();
      },
      error: (error: Error) => {
        this.openSnackBar(
          "Erreur lors de l'ajout du produit " + this.produitName + '.'
        );
        console.error('Error adding product:', error);
      },
    });
    this.produitName = '';
  }
  onSubmitCommercial() {
    this.api
      .createCommercial({
        firstName: this.commercialFirstName,
        lastName: this.commercialLastName,
      } as Commercial)
      .subscribe({
        next: () => {
          this.openSnackBar(
            'Le commercial ' +
              this.commercialFirstName +
              ' ' +
              this.commercialLastName +
              ' a bien été ajouté !'
          );

          this.commercialFirstName = '';
          this.commercialLastName = '';
          this.getCommercial();
        },
        error: (error: Error) => {
          this.openSnackBar(
            "Erreur lors de l'ajout du commercial " +
              this.commercialFirstName +
              ' ' +
              this.commercialLastName +
              '.'
          );
          console.error('Error adding commercial:', error);
        },
      });
  }

  getProduit() {
    this.api.getProduits().subscribe((produits) => {
      this.produits = produits;
    });
  }
  getCommercial() {
    this.api.getCommercials().subscribe((commercials) => {
      this.commercial = commercials;
    });
  }

  getTitres() {
    this.api.getTitres().subscribe((titres) => {
      this.titres = titres;
    });
  }

  onSubmitTitre() {
    const titreName = this.titreName;
    this.api.ajoutTitre({ name: titreName } as getTitre).subscribe({
      next: () => {
        this.openSnackBar('Le titre ' + titreName + ' a bien été ajouté !');
        this.getTitres();
        this.titreName = '';
      },
      error: (error: Error) => {
        this.openSnackBar("Erreur lors de l'ajout du titre " + titreName + '.');
        console.error('Error adding titre:', error);
      },
    });
  }

  ngOnInit(): void {
    this.getProduit();
    this.getCommercial();
    this.getTitres();
  }
}
