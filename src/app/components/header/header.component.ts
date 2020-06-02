import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Observable, of } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "../header/header.component.html",
  styleUrls: ["../header/header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isAuthenticated$: Observable<boolean> = of(false);
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAuthenticated$ = this.authService.getAuthStatus();
  }

  onLogout = () => {
    this.authService.clearToken();
  };
}
