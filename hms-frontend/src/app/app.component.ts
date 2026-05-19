// Author: Abdulla Mumin Mohamed | S2401551
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .page-container { min-height: 100vh; display: flex; flex-direction: column; }
    .main-content { flex: 1; }
  `]
})
export class AppComponent {}
