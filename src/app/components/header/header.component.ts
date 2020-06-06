import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromApp from "src/app/+store/app.reducer";
import * as authActions from "src/app/auth/+store/auth-actions";
@Component({
  selector: "app-header",
  templateUrl: "../header/header.component.html",
  styleUrls: ["../header/header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isAuthenticated$: Observable<{ authStatus: boolean }>;
  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.isAuthenticated$ = this.store.select("auth");
  }

  onLogout = () => {
    this.store.dispatch(new authActions.Logout());
  };
}
