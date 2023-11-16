import { Dialog, DialogRef } from "@angular/cdk/dialog"
import {
  AfterViewInit,
  Component,
  NgZone,
  TemplateRef,
  ViewChild,
  inject,
} from "@angular/core"
import { Router } from "@angular/router"

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements AfterViewInit {
  @ViewChild("content") contentRef!: TemplateRef<HTMLDivElement>

  dialog = inject(Dialog)
  dialogRef!: DialogRef<string>
  zone = inject(NgZone)
  router = inject(Router)

  activeIndex = 0

  ngAfterViewInit() {
    this.dialogRef = this.dialog.open<string, HTMLDivElement>(this.contentRef, {
      width: "1335px",
    })
    this.dialogRef.closed.subscribe(() => {
      this.zone.run(() => {
        this.router.navigate(["", { outlets: { dialog: null } }])
      })
    })
  }
}
