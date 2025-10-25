import { Component, inject, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { Api } from '../../../services/api/api';
import { Produit } from './dto/produit.model';
import { CommonModule } from '@angular/common';
import { Commercial } from './dto/commercial.model';


@Component({
  selector: 'app-ajout-produit',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, MatCardModule, CommonModule],
  templateUrl: './ajoutProduit.html',
  styleUrl: './ajoutProduit.css',
})
export class AjoutProduit implements OnInit {
  produitName = '';
  produits: Produit[] = [];
  commercial: Commercial[] = [];

  commercialLastName = '';
  commercialFirstName = '';

  private readonly api = inject(Api);

  onSubmitProduit() {
    this.api.ajoutProduit({ nom: this.produitName } as Produit).subscribe(() => {
      this.getProduit();
    });
    this.produitName = '';
  }
  onSubmitCommercial() {
    this.api.createCommercial({ firstName: this.commercialFirstName, lastName: this.commercialLastName } as Commercial).subscribe(() => {
      this.getCommercial();
    });
    this.commercialFirstName = '';
    this.commercialLastName = '';
  }

  getProduit(){
    this.api.getProduits().subscribe((produits) => {
        this.produits = produits;
      });
  }
  getCommercial(){
    this.api.getCommercials().subscribe((commercials) => {
        this.commercial = commercials;
      });
  }

  ngOnInit(): void {
      this.getProduit();
      this.getCommercial();
  }

}
