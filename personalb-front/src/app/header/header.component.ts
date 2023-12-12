import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router) {}

  navigateToBudget() {
    this.router.navigate(['/budget']);
  }

  navigateToExpense() {
    this.router.navigate(['/expense']);
  }
}
