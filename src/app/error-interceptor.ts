import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { Injectable } from "@angular/core";
import { ErrorModal } from "./components/error/error-modal/error-modal.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(public dialog: MatDialog) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const dialogRef = this.dialog.open(ErrorModal, {
          width: "250px",
          data: error.error.message
            ? error.error.message
            : "An unknown error occured.",
        });
        dialogRef.afterClosed().subscribe(() => {
          console.log("The dialog was closed");
        });
        return throwError(error);
      })
    );
  }
}
