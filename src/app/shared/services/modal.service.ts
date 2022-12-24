import { Dialog } from "@angular/cdk/dialog"
import { forwardRef, Inject, Injectable, Optional } from "@angular/core"
import { IndividualConfig, ToastrService } from "ngx-toastr"
import { ModalComponent } from "../components/modal/modal.component"
import { NotificationToastComponent } from "../components/notification-toast/notification-toast.component"

export interface INotificationToastData {
  message: string
  title?: string
  image_logo?: string
  image_main?: string
  data: any
}

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor(
    public dialog: Dialog,
    @Optional()
    @Inject(forwardRef(() => ToastrService))
    private toastr: ToastrService
  ) {}

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

  showNotificationToast(
    data: INotificationToastData,
    toastrConfig: Partial<IndividualConfig>
  ) {
    const toast = this.toastr.show(data.message, data.title, {
      ...toastrConfig,
      toastComponent: NotificationToastComponent,
    })
    toast.toastRef.componentInstance.data = data
    return toast
  }
}
