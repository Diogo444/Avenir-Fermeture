import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-one-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './one-client.html',
  styleUrls: ['./one-client.css']
})
export class OneClientComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
