import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-general',
  imports: [MatIconModule, MatCardModule],
  templateUrl: './general.html',
  styleUrl: './general.css',
})
export class General {}
