import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Subject } from "rxjs";
import { IAuth } from "src/models/auth.interface";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token: string;
  private expiresIn: number;
  private tokenTimer: any;
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new Subject<string>();
  private apiUrl = environment.apiUrl + "/auth";
  private userId: string;
  constructor(private http: HttpClient, private router: Router) {}

  autoAuthUser = () => {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    const currentTime = new Date();
    const expiresIn = authData.expDate.getTime() - currentTime.getTime();
    if (expiresIn > 0) {
      this.token = authData.token;
      this.userId = authData.userId;
      this.setAuthTimer(expiresIn);
      this.authStatusSubject.next(true);
    }
  };
  getToken = () => this.token;

  getUserId = () => this.userId;

  clearToken = () => {
    this.token = null;
    this.userId = null;
    this.authStatusSubject.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/auth/login"]);
  };

  private saveAuthData = (
    token: string,
    expirationDate: Date,
    userId: string
  ) => {
    localStorage.setItem("user-token", token);
    localStorage.setItem("exp-date", expirationDate.toISOString());
    localStorage.setItem("user-id", userId);
  };

  private clearAuthData = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("exp-date");
    localStorage.removeItem("user-id");
  };

  private getAuthData = () => {
    const userToken = localStorage.getItem("user-token");
    const expDate = localStorage.getItem("exp-date");
    const userId = localStorage.getItem("user-id");
    if (!userToken || !expDate || !userId) {
      return;
    }
    return {
      token: userToken,
      expDate: new Date(expDate),
      userId: userId,
    };
  };

  private setAuthTimer = (duration: number) => {
    this.tokenTimer = setTimeout(() => {
      this.clearToken();
    }, duration);
  };
  getAuthStatus = () => this.authStatusSubject.asObservable();

  getError = () => this.errorSubject.asObservable();
  createNewUser = (authData: IAuth) => {
    this.http.post(`${this.apiUrl}/signup`, authData).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(["/"]);
      },
      (err: HttpErrorResponse) => {
        console.error(err.error);
        this.errorSubject.next(err.error.message);
      }
    );
  };
  login = (authData: IAuth) => {
    this.http.post<any>(`${this.apiUrl}/login`, authData).subscribe(
      (res) => {
        console.log(res.message);
        this.token = res.token;
        this.userId = res.userData.id;
        this.expiresIn = res.expiresIn * 1000;
        if (this.token) {
          this.authStatusSubject.next(true);
          this.setAuthTimer(this.expiresIn);
          const currentDate = new Date().getTime();
          const expirationDate = new Date(currentDate + this.expiresIn);
          this.saveAuthData(this.token, expirationDate, this.userId);
          this.router.navigate(["/"]);
        }
      },
      (err: HttpErrorResponse) => {
        console.error(err.error);
        this.errorSubject.next(err.error.message);
      }
    );
  };
}
