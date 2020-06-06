import { Injectable } from "@angular/core";
import * as fromApp from "../+store/app.reducer";
import * as actions from "src/app/auth/+store/auth-actions";
import { Store } from "@ngrx/store";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private tokenTimer: any;

  constructor(private store: Store<fromApp.AppState>) {}

  setAuthTimer = (duration: number) => {
    this.tokenTimer = setTimeout(() => {
      this.store.dispatch(new actions.Logout());
    }, duration);
  };

  clearAuthTomer = () => {
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
      this.tokenTimer = null;
    }
  };
}
