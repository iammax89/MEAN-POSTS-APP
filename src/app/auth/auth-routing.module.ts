import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthFormComponent } from "./auth-form.component";

const routes: Routes = [
  { path: "login", component: AuthFormComponent },
  { path: "signup", component: AuthFormComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
