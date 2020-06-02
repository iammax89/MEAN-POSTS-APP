import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { take } from "rxjs/operators";

@Injectable()
export class CanActivateGuard implements CanActivate {
  isAuth: boolean;
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.authService
      .getAuthStatus()
      .pipe(take(1))
      .subscribe((isAuth) => {
        this.isAuth = isAuth;
        if (!this.isAuth) {
          this.router.navigate(["/login"]);
        }
      });
    return this.isAuth;
  }
}
