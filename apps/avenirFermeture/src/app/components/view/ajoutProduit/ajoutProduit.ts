import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ProduitsService } from '../../../services/produits.service';
import { ReferentielsService } from '../../../services/referentiels.service';
import { Produit } from '../../../models/produit.model';
import { CommonModule } from '@angular/common';
import { Commercial } from '../../../models/commercial.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getTitre } from '../../../models/titres.model';
import { CreateFournisseurDto } from '../../../models/create-fournisseur.dto';
import { Fournisseur } from '../../../models/fournisseur.model';
import { Status } from '../../../models/status.model';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-ajout-produit',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatDividerModule,
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

  fournisseurName = '';
  fournisseurs: Fournisseur[] = [];

  Status: Status[] = [];
  statutName = '';
  statutColor = '#000000';

  private readonly produitsService = inject(ProduitsService);
  private readonly referentielsService = inject(ReferentielsService);
  private _snackBar = inject(MatSnackBar);

  durationInSeconds = 5;

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: this.durationInSeconds * 1000,
    });
  }

  onSubmitProduit() {
    this.produitsService.ajoutProduit({ nom: this.produitName } as Produit).subscribe({
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
    this.referentielsService
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
    this.produitsService.getProduits().subscribe((produits) => {
      this.produits = produits;
    });
  }
  getCommercial() {
    this.referentielsService.getCommercials().subscribe((commercials) => {
      this.commercial = commercials;
    });
  }

  getTitres() {
    this.referentielsService.getTitres().subscribe((titres) => {
      this.titres = titres;
    });
  }

  onSubmitTitre() {
    const titreName = this.titreName;
    this.referentielsService.ajoutTitre({ name: titreName } as getTitre).subscribe({
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

  onSubmitFournisseur() {
    const fournisseurName = this.fournisseurName;
    this.referentielsService
      .createFournisseur({
        nom: fournisseurName,
      } satisfies CreateFournisseurDto)
      .subscribe({
        next: () => {
          this.openSnackBar(
            'Le fournisseur ' + fournisseurName + ' a bien été ajouté !'
          );
          this.fournisseurName = '';
          this.getFournisseur();
        },
        error: (error: Error) => {
          this.openSnackBar(
            "Erreur lors de l'ajout du fournisseur " + fournisseurName + '.'
          );
          console.error('Error adding fournisseur:', error);
        },
      });
  }

  getFournisseur() {
    this.referentielsService.getFournisseurs().subscribe((fournisseurs) => {
      this.fournisseurs = fournisseurs;
    });
  }

  onSubmitStatut() {
    const statutName = this.statutName;
    const statutColor = this.statutColor;
    this.referentielsService.createStatus({ name: statutName, color: statutColor }).subscribe({
      next: () => {
        this.openSnackBar('Le statut ' + statutName + ' a bien été ajouté !');
        this.getStatus();
        this.statutName = '';
        this.statutColor = '#000000';
      },
      error: (error: Error) => {
        this.openSnackBar(
          "Erreur lors de l'ajout du statut " + statutName + '.'
        );
        console.error('Error adding statut:', error);
      },
    });
  }

  getStatus() {
    this.referentielsService.getStatus().subscribe((status) => {
      this.Status = status;
    });
  }

  ngOnInit(): void {
    this.getProduit();
    this.getCommercial();
    this.getTitres();
    this.getFournisseur();
    this.getStatus();
  }
}
