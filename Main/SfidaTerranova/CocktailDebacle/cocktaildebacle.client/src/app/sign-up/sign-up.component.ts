import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateHtmlService } from '../services/translate-html.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatRadioModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signupForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private translateHtmlService: TranslateHtmlService,
  ) {
    this.signupForm = this.fb.group({
      FirstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZÀ-ÿ\s']+$/)]],
      LastName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s']+$/)]],
      userName: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      Email: ['', [Validators.required, Validators.email]],
      ConfirmEmail: ['', [Validators.required, Validators.email]],
      Password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      ConfirmPassword: ['', Validators.required],
      AcceptCookies: [false],
      IsAdult: [false],
    }, {
      validators: [this.checkPasswords, this.checkEmails]
    });    
  }
    ngOnInit(): void {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      console.log('Saved Language:', savedLanguage); // Log per vedere se il valore è presente

      if (savedLanguage) {
        console.log("Language found in localStorage:", savedLanguage);
        this.translateHtmlService.translateElements(savedLanguage);
      } else {
        console.log("No language found, setting to default");
        this.translateHtmlService.translateElements('en'); // Impostazione predefinita della lingua
      }
    }
  // Controllo avanzato password
  checkPasswords: (group: AbstractControl) => ValidationErrors | null = (group: AbstractControl) => {
    const password = group.get('Password')?.value;
    const confirmPassword = group.get('ConfirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    if (password !== confirmPassword) {
      group.get('ConfirmPassword')?.setErrors({ notSame: true });
      return { notSame: true };
    } else {
      group.get('ConfirmPassword')?.setErrors(null);
      return null;
    }
  };

  // Controllo email
  checkEmails: (group: AbstractControl) => ValidationErrors | null = (group: AbstractControl) => {
    const email = group.get('Email')?.value;
    const confirmEmail = group.get('ConfirmEmail')?.value;

    if (!email || !confirmEmail) {
      return null;
    }

    if (email !== confirmEmail) {
      group.get('ConfirmEmail')?.setErrors({ emailsNotSame: true });
      return { emailsNotSame: true };
    } else {
      group.get('ConfirmEmail')?.setErrors(null);
      return null;
    }
  };

  // Navigazione
  navigateToLoginSignup() {
    this.router.navigate(['/login-signup']);
  }

  // Submit del form
  onSubmit() {
    if (this.signupForm.invalid) {
      this.markAllAsTouched();
      this.snackBar.open('Compila correttamente tutti i campi', 'Chiudi', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    const user = {
      userName: this.signupForm.value.userName,
      name: this.signupForm.value.FirstName,
      lastName: this.signupForm.value.LastName,
      email: this.signupForm.value.Email,
      PasswordHash: this.signupForm.value.Password,
      acceptCookies: this.signupForm.value.AcceptCookies,
      IsOfMajorityAge: this.signupForm.value.IsAdult 
    };
    

    this.userService.registerUser(user).subscribe({
      next: (response) => {
        this.snackBar.open('Registrazione avvenuta con successo!', 'Chiudi', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        setTimeout(() => {
          this.router.navigate(['/login-signup']);
        }, 1500);
      },
      error: (error) => {
        console.log('Error response:', error.error);
        this.snackBar.open(error.error, 'Chiudi', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.snackBar.open(error.error, 'Chiudi', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private markAllAsTouched() {
    Object.values(this.signupForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  get f() { return this.signupForm.controls; }
}