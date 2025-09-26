import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from './components/utils/navbar/navbar';


@Component({
  imports: [RouterModule, Navbar],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'avenirFermeture';
}
