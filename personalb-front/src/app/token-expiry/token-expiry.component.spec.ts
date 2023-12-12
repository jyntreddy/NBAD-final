import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenExpiryComponent } from './token-expiry.component';

describe('TokenExpiryComponent', () => {
  let component: TokenExpiryComponent;
  let fixture: ComponentFixture<TokenExpiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TokenExpiryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TokenExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
