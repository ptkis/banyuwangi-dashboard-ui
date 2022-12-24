import { Component, HostBinding, OnInit } from "@angular/core"
import { Toast, ToastrService, ToastPackage } from "ngx-toastr"
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from "@angular/animations"
import { INotificationToastData } from "../../services/modal.service"

@Component({
  selector: "[app-notification-toast]",
  templateUrl: "./notification-toast.component.html",
  styleUrls: ["./notification-toast.component.scss"],
  animations: [
    trigger("flyInOut", [
      state(
        "inactive",
        style({
          opacity: 0,
          transform: "translateX(100%)",
        })
      ),
      state("active", style({ opacity: 1 })),
      state("removed", style({ opacity: 0 })),
      transition(
        "inactive => active",
        animate("{{ easeTime }}ms {{ easing }}")
      ),
      transition("active => removed", animate("{{ easeTime }}ms {{ easing }}")),
    ]),
  ],
})
export class NotificationToastComponent extends Toast {
  @HostBinding("className") componentClass = "custom-toast-notification"

  data: INotificationToastData | undefined

  constructor(
    protected override toastrService: ToastrService,
    public override toastPackage: ToastPackage
  ) {
    super(toastrService, toastPackage)
  }

  action(event: Event) {
    this.toastPackage.triggerAction(this.data)
  }
}
