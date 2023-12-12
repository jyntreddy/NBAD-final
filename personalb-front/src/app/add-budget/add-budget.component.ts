import { Component, EventEmitter, Output } from '@angular/core';
import { BudgetService } from '../budget.service';

@Component({
  selector: 'app-add-budget',
  templateUrl: './add-budget.component.html',
  styleUrls: ['./add-budget.component.css']
})
export class AddBudgetComponent {
  budgetCriteria: string = '';
  amount: number = 0;
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  selectedMonths: string[] = [];
  @Output() closeAddBudget: EventEmitter<void> = new EventEmitter<void>();


  constructor(private budgetService: BudgetService) { }

  selectAllMonths(): void {
    this.selectedMonths = [...this.months];
  }

  hasSelectedMonths(): boolean {
    return this.selectedMonths.length > 0;
  }

  onSubmit(): void {
    if (this.budgetCriteria && this.amount > 0 && this.hasSelectedMonths()) {
      this.budgetService.addBudget(this.budgetCriteria, this.amount, this.selectedMonths)
        .subscribe(
          (response) => {
            console.log('Budget added successfully:', response);
            this.closeAddBudget.emit();
          },
          (error) => {
            console.error('Error adding budget:', error);
          }
        );
    }
  }
}
