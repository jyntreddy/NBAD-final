import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private apiUrl = 'http://3.145.178.204:3000';

  constructor(private http: HttpClient) {}
  token = localStorage.getItem('token');
  addBudget(
    budgetCriteria: string,
    amount: number,
    selectedMonths: string[]
  ): Observable<any> {
    let headers = new HttpHeaders();
    if (this.token !== null) {
      headers = headers.set('Authorization', this.token);
    }

    const data = {
      budgetCriteria: budgetCriteria,
      amount: amount,
      selectedMonths: selectedMonths,
    };
    return this.http.post<any>(`${this.apiUrl}/addBudget`, data, {
      headers: headers,
    });
  }
  getBudgetByMonth(month: string): Observable<any> {
    let headers = new HttpHeaders();
    if (this.token !== null) {
      headers = headers.set('Authorization', this.token);
    }
    return this.http.get<any>(`${this.apiUrl}/getBudget/${month}`, {
      headers: headers,
    });
  }
}
