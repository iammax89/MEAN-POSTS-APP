import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from "src/app/+store/app.reducer";
import { take, exhaustMap } from "rxjs/operators";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select("auth").pipe(
      take(1),
      exhaustMap((authState) => {
        if (!authState.token) {
          return next.handle(req);
        }
        const authReq = req.clone({
          headers: req.headers.set(
            "Authorization",
            `Bearer ${authState.token}`
          ),
        });
        return next.handle(authReq);
      })
    );
  }
}
