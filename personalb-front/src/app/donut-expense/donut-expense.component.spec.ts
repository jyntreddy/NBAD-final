import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonutExpenseComponent } from './donut-expense.component';

describe('DonutExpenseComponent', () => {
  let component: DonutExpenseComponent;
  let fixture: ComponentFixture<DonutExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonutExpenseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DonutExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
