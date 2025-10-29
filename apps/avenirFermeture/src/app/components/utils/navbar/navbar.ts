import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, RouterLink, NgIf, NgClass],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected isOpen = false;

  protected toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  protected closeMenu(): void {
    this.isOpen = false;
  }

  protected onNavigate(): void {
    this.closeMenu();
  }
}
