import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  signUpError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.signUpError = 'Passwords do not match';
      return;
    }
    const observer: Observer<any> = {
      next: (response: any) => {
        console.log('SignUp response:', response);
        if (response.success) {
          this.router.navigate(['/login']);
        } else {
          this.signUpError = 'SignUp Failed';
        }
      },
      error: (error: any) => {
        this.signUpError = error.message;
      },
      complete: () => {},
    };

    this.authService
      .signup(
        this.firstName,
        this.lastName,
        this.email,
        this.username,
        this.password
      )
      .subscribe(observer);
  }
}
