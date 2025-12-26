import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-navbar',
  imports: [MatIconModule, MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly theme = inject(ThemeService);

  protected readonly isOpen = signal(false);
  protected readonly navItems = [
    { route: '/', icon: 'dashboard', label: 'Tableau de bord / Dashboard', exact: true },
    { route: '/clients', icon: 'person', label: 'Page Clients', exact: false },
    { route: '/commercial', icon: 'handshake', label: 'Page Commercial', exact: false },
    { route: '/comptabilite', icon: 'attach_money', label: 'Page Comptabilité', exact: false },
    { route: '/dev-ajout-produit', icon: 'code', label: 'Ajout produit (dev)', exact: false },
  ] as const;

  protected toggleTheme(): void {
    this.theme.toggle();
  }

  protected toggleMenu(): void {
    this.isOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isOpen.set(false);
  }

  protected onNavigate(): void {
    this.closeMenu();
  }
}
