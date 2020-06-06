import { Actions, ofType, Effect } from "@ngrx/effects";
import * as actions from "./auth-actions";
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

export interface LoginResponse {
  message: string;
  userData: {
    id: string;
    email: string;
  };
  token: string;
  expiresIn: number;
}

const handleAuthentication = (resData: LoginResponse) => {
  console.log(resData.message);
  saveAuthData(resData.token, resData.expiresIn, resData.userData.id);
  return new actions.AuthenticateSuccess({
    token: resData.token,
    userId: resData.userData.id,
  });
};

const saveAuthData = (
  token: string,
  expirationDate: number,
  userId: string
) => {
  const currentDate = new Date().getTime();
  const expDate = new Date(currentDate + expirationDate * 1000);
  localStorage.setItem("user-token", token);
  localStorage.setItem("exp-date", expDate.toISOString());
  localStorage.setItem("user-id", userId);
};

const clearAuthData = () => {
  localStorage.removeItem("user-token");
  localStorage.removeItem("exp-date");
  localStorage.removeItem("user-id");
};

const getAuthData = () => {
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

@Injectable()
export class AuthEffects {
  private apiUrl = environment.apiUrl + "/auth";

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(actions.AUTH_SIGNUP_INIT),
    switchMap((authData: actions.SignupInit) => {
      return this.http
        .post<LoginResponse>(`${this.apiUrl}/signup`, authData.payload)
        .pipe(
          tap((resData) =>
            this.authService.setAuthTimer(resData.expiresIn * 1000)
          ),
          map((resData) => handleAuthentication(resData)),
          catchError((err) => {
            return of(new actions.AuthenticateFail(err.error.message));
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(actions.AUTH_LOGIN_INIT),
    switchMap((authData: actions.LoginInit) => {
      return this.http
        .post<LoginResponse>(`${this.apiUrl}/login`, authData.payload)
        .pipe(
          tap((resData) =>
            this.authService.setAuthTimer(resData.expiresIn * 1000)
          ),
          map((resData) => handleAuthentication(resData)),
          catchError((err) => {
            return of(new actions.AuthenticateFail(err.error.message));
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(actions.AUTH_SUCCESS),
    tap(() => this.router.navigate(["/"]))
  );

  @Effect()
  authAutoLogin = this.actions$.pipe(
    ofType(actions.AUTH_AUTO_LOGIN),
    map(() => {
      const authData = getAuthData();
      if (!authData) {
        return { type: "DUMMY" };
      }
      const currentTime = new Date();
      const expiresIn = authData.expDate.getTime() - currentTime.getTime();
      if (expiresIn > 0) {
        this.authService.setAuthTimer(expiresIn);
        return new actions.AuthenticateSuccess({
          token: authData.token,
          userId: authData.userId,
        });
      }
      return { type: "DUMMY" };
    })
  );
  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(actions.AUTH_LOGOUT),
    tap(() => {
      clearAuthData();
      this.authService.clearAuthTomer();
      this.router.navigate(["/auth/login"]);
    })
  );
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
