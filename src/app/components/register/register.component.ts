import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  isLoading: boolean = false;
  msgError: string = '';

  constructor(
    private _AuthService: AuthService,
    private _FormBilder: FormBuilder,
    private _Router: Router
  ) {}

  registerForm = this._FormBilder.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
  });

  registerSubmit() {
    {
      if (this.registerForm.valid) {
        this.isLoading = true;
        this._AuthService.setRegisterForm(this.registerForm.value).subscribe({
          next: (res) => {
            console.log(res); // tmamm --logic navigato login
            if (res.message === 'User registered successfully') {
              this._Router.navigate(['login']);
            }
            this.isLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            this.msgError = err.error.message;
            console.log(err); // err {error: {message}};
            this.isLoading = false;
          },
        });
        // logic
      } else {
        this.registerForm.setErrors({ mismatch: true });
        this.registerForm.markAllAsTouched();
      }
    }
  }
}
