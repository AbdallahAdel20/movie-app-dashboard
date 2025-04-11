import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  private readonly _HttpClient = inject(HttpClient);
  private readonly _Router=inject(Router);
  
  userDate:any = null;
  
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  
  setRegisterForm(data:object) : Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}auth/register`,data);
  }

  setloginForm(data:object) : Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}auth/login`,data);
  }

  saveUserData():void{
    if(this.isBrowser() && localStorage.getItem('userToken') !== null){
      this.userDate = jwtDecode(localStorage.getItem('userToken')!);
      console.log(this.userDate);
    }
  }

  logout():void{
    if(this.isBrowser()) {
      localStorage.removeItem('userToken');
      this.userDate = null;
    }
    this._Router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isBrowser() && !!localStorage.getItem('userToken');
  }

  getUserRole(): string {
    if (!this.isBrowser()) return '';
    const token = localStorage.getItem('userToken');
    if (!token) return '';
    const decoded: any = jwtDecode(token);
    return decoded.role;
  }
}
