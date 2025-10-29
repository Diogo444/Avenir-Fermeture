import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-commandes',
  imports: [MatIconModule, MatListModule, MatCardModule, MatChipsModule],
  templateUrl: './commandes.html',
  styleUrl: './commandes.css',
})
export class Commandes {}
