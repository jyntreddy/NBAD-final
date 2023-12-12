import { Component } from '@angular/core';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css',
})
export class ExpensesComponent {
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
  expenses: any[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    this.selectedMonth = this.months[currentMonthIndex];
    this.getExpenseByMonth();
  }

  getExpenseByMonth(): void {
    this.expenseService.getExpenseByMonth(this.selectedMonth).subscribe(
      (response) => {
        if (Array.isArray(response) && response.length > 0) {
          this.expenses = response.map((item: any) => ({
            expense: item.spent_amount,
            budgetCriteria: item.budget_criteria,
          }));
        } else {
          console.error('No expense data found for the selected month.');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  onChangeMonth(): void {
    this.getExpenseByMonth();
  }

  showAddExpense: boolean = false;

  toggleAddExpense(): void {
    this.showAddExpense = !this.showAddExpense;
  }

  closeAddExpense(): void {
    this.showAddExpense = false;
    this.getExpenseByMonth();
  }
}
