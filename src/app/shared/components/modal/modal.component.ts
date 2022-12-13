import { DialogRef, DIALOG_DATA } from "@angular/cdk/dialog"
import { Component, Inject, OnInit, Optional } from "@angular/core"

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent {
  constructor(
    @Optional() public dialogRef?: DialogRef<boolean>,
    @Optional()
    @Inject(DIALOG_DATA)
    public data?: {
      title?: string
      message?: string
      btnConfirm?: string
      btnCancel?: string
      loader?: boolean
    }
  ) {}
}
