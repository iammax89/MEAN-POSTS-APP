import { Action } from "@ngrx/store";
import { IAuth } from "src/models/auth.interface";

export const AUTH_SIGNUP_INIT = "[Auth] Signup Init";

export const AUTH_LOGIN_INIT = "[Auth] Login Init";
export const AUTH_SUCCESS = "[Auth] Success";
export const AUTH_FAIL = "[Auth] Fail";

export const AUTH_LOGOUT = "[Auth] Logout";

export const AUTH_AUTO_LOGIN = "[Auth] Auto Login";

export class SignupInit implements Action {
  readonly type = AUTH_SIGNUP_INIT;
  constructor(public payload: IAuth) {}
}

export class LoginInit implements Action {
  readonly type = AUTH_LOGIN_INIT;
  constructor(public payload: IAuth) {}
}

export class AuthenticateSuccess implements Action {
  readonly type = AUTH_SUCCESS;
  constructor(
    public payload: {
      token: string;
      userId: string;
    }
  ) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTH_FAIL;
  constructor(public payload: string) {}
}

export class Logout implements Action {
  readonly type = AUTH_LOGOUT;
}

export class AutoLogin implements Action {
  readonly type = AUTH_AUTO_LOGIN;
}

export type AuthActions =
  | SignupInit
  | LoginInit
  | AuthenticateSuccess
  | AuthenticateFail
  | Logout
  | AutoLogin;
