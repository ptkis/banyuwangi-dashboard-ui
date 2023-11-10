import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  inject,
} from "@angular/core"
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"
import { filter, map, scan, takeWhile, tap, timer } from "rxjs"
import { AppService } from "src/app/app.service"
import { CCTVData } from "src/app/shared/services/hik.service"

@UntilDestroy()
@Component({
  selector: "app-html-marker",
  templateUrl: "./html-marker.component.html",
  styleUrls: ["./html-marker.component.scss"],
})
export class HTMLMarkerComponent {
  @Output() markerClick = new EventEmitter<boolean>()

  dismissTime = 10

  appService = inject(AppService)
  hasAlert$ = this.appService.cctvIdHasAlerts$.pipe(
    map((ids) => ids.includes(this.data?.cctv_id + "")),
    tap((hasAlert) => {
      const parentElement = this.elementRef.nativeElement.parentElement
      if (parentElement) {
        parentElement.style.zIndex = hasAlert ? "10" : "0"
      }
    })
  )

  data: CCTVData | undefined
  timer$ = timer(0, 1000).pipe(
    scan((acc) => --acc, this.dismissTime),
    takeWhile((x) => x >= 0),
    tap((val) => {
      if (val <= 0) {
        this.removeAlert()
      }
    }),
    untilDestroyed(this)
  )

  elementRef: ElementRef<HTMLElement> = inject(ElementRef)

  cctvClick() {
    this.markerClick.emit(true)
  }

  removeAlert() {
    this.appService.removeAlertFromId(this.data?.cctv_id + "")
  }
}
