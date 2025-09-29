import { Component, inject, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { Api } from '../../../services/api/api';
import { Produit } from './dto/produit.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-ajout-produit',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, MatCardModule, CommonModule],
  templateUrl: './ajoutProduit.html',
  styleUrl: './ajoutProduit.css',
})
export class AjoutProduit implements OnInit {
  produitName = '';
  produits: Produit[] = [];

  private readonly api = inject(Api);

  onSubmit() {
    this.api.ajoutProduit({ nom: this.produitName } as Produit).subscribe(() => {
      this.getProduit();
    });
    this.produitName = '';
  }

  getProduit(){
    this.api.getProduits().subscribe((produits) => {
        this.produits = produits;
      });
  }

  ngOnInit(): void {
      this.getProduit();
  }

}
