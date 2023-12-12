import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../budget.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
})
export class BudgetComponent implements OnInit {
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  selectedMonth: string = '';
  budgets: any[] = [];

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    this.selectedMonth = this.months[currentMonthIndex];
    this.getBudgetByMonth();
  }

  getBudgetByMonth(): void {
    this.budgetService.getBudgetByMonth(this.selectedMonth).subscribe(
      (response) => {
        if (Array.isArray(response) && response.length > 0) {
          this.budgets = response.map((item: any) => ({
            budgetCriteria: item.budget_criteria,
            amount: item.amount,
          }));
        } else {
          console.error('No budget data found for the selected month.');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  onChangeMonth(): void {
    this.getBudgetByMonth();
  }

  showAddBudget: boolean = false;

  toggleAddBudget(): void {
    this.showAddBudget = !this.showAddBudget;
  }

  closeAddBudget(): void {
    this.showAddBudget = false;
    this.getBudgetByMonth();
  }
}
