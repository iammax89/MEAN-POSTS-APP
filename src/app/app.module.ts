import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderComponent } from "./components/header/header.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorModal } from "./components/error/error-modal/error-modal.component";
import { AngularMaterialModule } from "./common/material.module";
import { PostsModule } from "./components/posts/posts.module";
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [AppComponent, HeaderComponent, ErrorModal],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    PostsModule,
    StoreModule.forRoot({}, {}),
  ],
  entryComponents: [ErrorModal],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
