import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    const observer: Observer<any> = {
      next: (response: any) => {
        console.log('Login response:', response);
        if (response.response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.loginError = 'Invalid credentials';
        }
      },
      error: (error: any) => {
        this.loginError = error.error.message;
      },
      complete: () => {},
    };

    this.authService.login(this.username, this.password).subscribe(observer);
  }
}
