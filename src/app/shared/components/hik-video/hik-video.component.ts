import { AfterViewInit, Component, Input, OnInit } from "@angular/core"
import { finalize } from "rxjs"
import { DashboardService } from "src/app/pages/dashboard/dashboard.service"

@Component({
  selector: "app-hik-video",
  templateUrl: "./hik-video.component.html",
  styleUrls: ["./hik-video.component.scss"],
})
export class HikVideoComponent implements AfterViewInit {
  @Input() cctv_id!: string

  isLoading = true
  url: string = ""

  constructor(private _dashboardService: DashboardService) {}

  ngAfterViewInit(): void {
    this.isLoading = true
    this._dashboardService
      .getStreamingURL(this.cctv_id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((resp) => (this.url = resp.data.url))
  }
}
