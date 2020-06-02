import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PostListComponent } from "./components/posts/post-list/post-list.component";
import { PostCreateComponent } from "./components/posts/post-create/post-create.component";
import { CanActivateGuard } from "./auth/auth.guard";

const routes: Routes = [
  { path: "", component: PostListComponent },

  {
    path: "create",
    component: PostCreateComponent,
    canActivate: [CanActivateGuard],
  },
  {
    path: "edit/:id",
    component: PostCreateComponent,
    canActivate: [CanActivateGuard],
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanActivateGuard],
})
export class AppRoutingModule {}
