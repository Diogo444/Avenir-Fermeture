import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { Api } from '../../../services/api/api';
import { CommonModule } from '@angular/common';
import { Client } from '../../../models/clients.model';





@Component({
  selector: 'app-clients',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatListModule, CommonModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  client: Client[] = [];


  private readonly api = inject(Api)

  ngOnInit(): void {
      this.api.getClients().subscribe((data) => {
        this.client = data;
      });
  }

}
