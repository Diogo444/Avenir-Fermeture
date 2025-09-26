import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';





@Component({
  selector: 'app-clients',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatListModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients {

}
