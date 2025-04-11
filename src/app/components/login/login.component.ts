import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule , RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading: boolean = false;
  msgError: string = '';
  userRole : String = '';

  constructor(private _AuthService: AuthService , private _FormBilder:FormBuilder , private _Router:Router) { }


  loginForm = this._FormBilder.group({
    username: [null, [Validators.required]],
    password: [null , [Validators.required, Validators.pattern(/^\w{6,}$/),]],
  });


  loginSubmit() {
    {
      if (this.loginForm.valid) {
        this.isLoading = true;
        this._AuthService.setloginForm(this.loginForm.value).subscribe({
          next: (res) => {
            console.log(res); // tmamm --logic navigato login
            if (res.message === 'Operation successful') {
              localStorage.setItem('userToken', res.data.accessToken);
              // this._AuthService.saveUserData();
              // this._Router.navigate(['/home']);
              this.userRole = this._AuthService.getUserRole();
              console.log(this.userRole);
              if(this.userRole == 'ADMIN'){
                this._Router.navigate(['admin']);
              }else{
                this._Router.navigate(['user']);
              }

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
      }
      else{
        this.loginForm.setErrors({ mismatch: true });
        this.loginForm.markAllAsTouched();
      }
    }
  }

}
