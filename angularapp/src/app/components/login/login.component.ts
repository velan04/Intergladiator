import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    const loginData: LoginModel = { email: this.email, password: this.password };
    
    this.authService.login(loginData).subscribe(
      (response) => {
        // Only navigate if a token was stored and the user is authenticated
        if (response?.token && this.authService.isAuthenticated()) {
          if (this.authService.isAdmin()) {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.error = '*Login failed. Please check your credentials.';
        }
      },
      (error) => {
        if (error.status === 400 || error.status === 401 || error.status === 404) {
          this.error = '*Invalid email or password.';
        } else {
          this.error = '*Something went wrong. Please try again later.';
        }
      }
    );
  }
  
}
