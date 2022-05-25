import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + '/user/';

/**All console log statements here show in the internet console */

@Injectable({ providedIn: "root"})
export class AuthService {
  private userAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router){}

  getToken(){//use this method to get the private token
    return this.token;
  }

  getUserAuth(){
    return this.userAuthenticated;
  }

  getUserId(){
    return this.userId
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http
      .post(BACKEND_URL + "/signup", authData)
      .subscribe(() => {
        //console.log(response);
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + "/login", authData)
      .subscribe(response => {
        //console.log(response);//test if token logged
        const token = response.token;
        this.token = token;
        if (token){
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.userAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();// get current time stamp
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          //console.log(expirationDate);//test if we get right dateStamp
          this.saveAuthData(token, expirationDate, this.userId)
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      })
  }

  //This method initializs auth status if we leave the page
  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    //console.log(authInfo, expiresIn);//test if we makie into if block with token info
    if(expiresIn > 0){
      this.token = authInfo.token;
      this.userAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout(){
    this.token = null;
    this.userId = null;
    this.userAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number){
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout( () => {
      this.logout();
      alert('Token Expired');
    }, duration *1000 );
  }

  //save login info so when users leave and comeback they remain logged in
  private saveAuthData(token: string, expiratonDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expiratonDate.toISOString());
    localStorage.setItem('userId', userId)
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem("expiration");
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
