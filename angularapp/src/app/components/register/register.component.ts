import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  readonly predefinedSecretKey = '987';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordComplexityValidator()]],
      confirmPassword: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      userRole: ['', Validators.required],
      secretKey: ['']
    }, { validators: [this.passwordMatchValidator()] });

    // Watch for role changes and update secret key validation dynamically
    this.registerForm.get('userRole')?.valueChanges.subscribe(role => {
      const secretControl = this.registerForm.get('secretKey');
      if (role === 'Admin') {
        secretControl?.setValidators([Validators.required, this.secretKeyValidator()]);
      } else {
        secretControl?.clearValidators();
      }
      secretControl?.updateValueAndValidity();
    });
  }

  // Validate password complexity
  passwordComplexityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const isValid = /[A-Z]/.test(value) &&
                      /[a-z]/.test(value) &&
                      /\d/.test(value) &&
                      /[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/.test(value);
      return isValid ? null : { weakPassword: true };
    };
  }

  // Validate password match
  passwordMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirm = group.get('confirmPassword')?.value;
      return password === confirm ? null : { passwordMismatch: true };
    };
  }

  // Validate admin secret key
  secretKeyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const errors: any = {};
  
      if (!value) {
        errors.required = true;
        errors.secretKeyMismatch = true; // show both when empty
      } else if (value !== this.predefinedSecretKey) {
        errors.secretKeyMismatch = true;
      }
  
      return Object.keys(errors).length ? errors : null;
    };
  }
  

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { username, email, password, mobileNumber, userRole } = this.registerForm.value;

    const user: User = {
      username: username,
      email: email,
      password: password,
      mobileNumber: mobileNumber,
      userRole: userRole
    };

    this.authService.register(user).subscribe({
      next: (res) => {
        // Check if res.error and res.error.message are defined
        this.successMessage = res.error?.message || 'Registration successful!';
        this.errorMessage = ''; // Clear error
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        
      },
      error: (err) => {
        // Check if err.error and err.error.message are defined
        this.errorMessage = err.error?.message || 'Something went wrong.';
        this.successMessage = ''; // Clear success
      }
    });
    
        
  }
}
