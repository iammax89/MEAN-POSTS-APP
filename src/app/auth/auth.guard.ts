import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { take, map } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as fromApp from "src/app/+store/app.reducer";
@Injectable()
export class CanActivateGuard implements CanActivate {
  isAuth: boolean;
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.authService;
    this.store
      .select("auth")
      .pipe(
        take(1),
        map((authState) => authState.authStatus)
      )
      .subscribe((authStatus) => {
        this.isAuth = authStatus;
        if (!this.isAuth) {
          this.router.navigate(["/auth/login"]);
        }
      });
    return this.isAuth;
  }
}
