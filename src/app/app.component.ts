import { Component, OnInit } from "@angular/core";
import * as fromApp from "src/app/+store/app.reducer";
import * as authActions from "src/app/auth/+store/auth-actions";
import { Store } from "@ngrx/store";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(private store: Store<fromApp.AppState>) {}
  ngOnInit() {
    this.store.dispatch(new authActions.AutoLogin());
  }
}
