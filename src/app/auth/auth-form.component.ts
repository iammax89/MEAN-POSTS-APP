import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, UrlSegment } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Subscription } from "rxjs";

@Component({
  templateUrl: "../auth/auth-form.component.html",
  styleUrls: ["../auth/auth-form.component.scss"],
})
export class AuthFormComponent implements OnInit, OnDestroy {
  authForm: FormGroup;
  isLoading = false;
  isLoginMode = false;
  error: string = null;
  private errorSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.errorSub = this.authService.getError().subscribe((err) => {
      this.error = err;
      this.isLoading = false;
      this.authForm.reset();
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
      this.authService.createNewUser({ ...this.authForm.value });
    } else {
      this.authService.login({ ...this.authForm.value });
    }
  };
  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
}
