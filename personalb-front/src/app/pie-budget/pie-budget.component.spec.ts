import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieBudgetComponent } from './pie-budget.component';

describe('PieBudgetComponent', () => {
  let component: PieBudgetComponent;
  let fixture: ComponentFixture<PieBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PieBudgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PieBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
