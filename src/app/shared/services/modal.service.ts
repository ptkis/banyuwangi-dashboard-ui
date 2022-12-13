import { Dialog } from "@angular/cdk/dialog"
import { Injectable } from "@angular/core"
import { ModalComponent } from "../components/modal/modal.component"

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor(public dialog: Dialog) {}

  showLoader(title?: string) {
    return this.dialog.open<boolean>(ModalComponent, {
      data: {
        title,
        loader: true,
      },
      disableClose: true,
      width: "300px",
      hasBackdrop: false,
    })
  }

  showConfirm(
    message: string,
    title?: string,
    btnConfirm = "OK",
    btnCancel = "Cancel"
  ) {
    return this.dialog.open<boolean>(ModalComponent, {
      data: {
        title,
        message,
        btnConfirm,
        btnCancel,
      },
      disableClose: true,
      width: "300px",
    })
  }
}
