import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, UrlSegment } from "@angular/router";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromApp from "src/app/+store/app.reducer";
import * as authActions from "src/app/auth/+store/auth-actions";
@Component({
  templateUrl: "../auth/auth-form.component.html",
  styleUrls: ["../auth/auth-form.component.scss"],
})
export class AuthFormComponent implements OnInit, OnDestroy {
  authForm: FormGroup;
  isLoading = false;
  isLoginMode = false;
  storeSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select("auth").subscribe((authState) => {
      this.isLoading = authState.isLoading;
      if (authState.error) {
        this.authForm.reset();
      }
    });

    this.route.url.subscribe((url: UrlSegment[]) => {
      if (url[0].path === "login") {
        this.isLoginMode = true;
      }
    });
    this.authForm = new FormGroup({
      email: new FormControl("", {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl("", {
        validators: [Validators.minLength(5), Validators.required],
      }),
    });
  }
  onSubmit = () => {
    if (this.authForm.invalid) {
      return;
    }
    this.isLoading = true;
    if (!this.isLoginMode) {
      this.store.dispatch(
        new authActions.SignupInit({ ...this.authForm.value })
      );
    } else {
      this.store.dispatch(
        new authActions.LoginInit({ ...this.authForm.value })
      );
    }
  };
  ngOnDestroy() {
    {
      this.storeSub && this.storeSub.unsubscribe();
    }
  }
}
