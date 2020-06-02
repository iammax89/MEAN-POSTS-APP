import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  templateUrl: "../error-modal/error-modal.component.html",
})
export class ErrorModal {
  constructor(
    public dialogRef: MatDialogRef<ErrorModal>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
