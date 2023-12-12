import { Component, EventEmitter, Output } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { BudgetService } from '../budget.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css',
})
export class AddExpenseComponent {
  budgetCriteria: string = '';
  expense: number = 0;
  selectedMonth: string = '';
  selectedBudget: string = '';
  budgets: any[] = [];
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
  addExpenseError: string = '';
  @Output() closeAddExpense: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private expenseService: ExpenseService,
    private budgetService: BudgetService
  ) {}

  getBudgetsForSelectedMonth() {
    if (this.selectedMonth) {
      this.budgetService.getBudgetByMonth(this.selectedMonth).subscribe(
        (response) => {
          if (Array.isArray(response) && response.length > 0) {
            this.budgets = response.map((item: any) => item.budget_criteria);
          } else {
            console.error('No budget data found for the selected month.');
          }
        },
        (error) => {
          this.addExpenseError = 'Error fetching budgets:';
        }
      );
    }
  }

  onSubmit(): void {
    if (this.selectedBudget && this.expense > 0 && this.selectedMonth) {
      this.expenseService
        .addExpense(this.selectedBudget, this.expense, this.selectedMonth)
        .subscribe(
          (response) => {
            console.log('Expense added successfully:', response);
            this.closeAddExpense.emit();
          },
          (error) => {
            console.error('Error adding expense:', error);
            this.addExpenseError = error.message;
          }
        );
    }
  }
}
