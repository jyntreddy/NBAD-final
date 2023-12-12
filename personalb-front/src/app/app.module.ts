import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgChartsModule } from 'ng2-charts';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './nav/nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenExpiryComponent } from './token-expiry/token-expiry.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { AddBudgetComponent } from './add-budget/add-budget.component';
import { BudgetComponent } from './budget/budget.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { PieBudgetComponent } from './pie-budget/pie-budget.component';
import { DonutExpenseComponent } from './donut-expense/donut-expense.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomepageComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    NavComponent,
    TokenExpiryComponent,
    SignUpComponent,
    ExpensesComponent,
    AddBudgetComponent,
    BudgetComponent,
    AddExpenseComponent,
    BarChartComponent,
    PieBudgetComponent,
    DonutExpenseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatCheckboxModule,
    NgChartsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
