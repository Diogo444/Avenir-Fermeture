import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from './shared/ui/navbar/navbar';


@Component({
  imports: [RouterModule, Navbar],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'avenirFermeture';
}
