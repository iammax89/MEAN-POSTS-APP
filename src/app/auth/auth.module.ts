import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthFormComponent } from "./auth-form.component";
import { AngularMaterialModule } from "../common/material.module";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
  declarations: [AuthFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AuthRoutingModule,
  ],
})
export class AuthModule {}
