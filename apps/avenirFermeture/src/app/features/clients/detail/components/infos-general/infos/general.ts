import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Client } from '../../../../../../models/clients.model';
import { CommonModule, DatePipe } from '@angular/common';
import { PhoneFormatPipe } from '../../../../../../shared/utils/pipes/phone-format.pipe';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [MatIconModule, MatCardModule, DatePipe, CommonModule, PhoneFormatPipe],
  templateUrl: './general.html',
  styleUrls: ['./general.css'],
})
export class General {
  @Input() client!: Client;
}

