import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';


import { Api } from '../../../services/api/api';
import { CommonModule } from '@angular/common';
import { Client } from '../../../models/clients.model';
import { Router } from '@angular/router';





@Component({
  selector: 'app-clients',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatListModule, CommonModule, MatTableModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  client: Client[] = [];
  displayedColumns: string[] = ['lastName', 'firstName', 'email', 'phone'];

  private readonly api = inject(Api)
  private readonly router = inject(Router)

  ngOnInit(): void {
      this.api.getClients().subscribe((data) => {
        this.client = data;
      });
  }

  addClient(){
    this.router.navigate(['/cree-client']);
  }

}
