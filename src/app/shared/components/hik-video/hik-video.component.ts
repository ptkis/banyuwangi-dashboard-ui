import { AfterViewInit, Component, Input, OnInit } from "@angular/core"
import { finalize } from "rxjs"
import { HCMService } from "../../services/hcm.service"

@Component({
  selector: "app-hik-video",
  templateUrl: "./hik-video.component.html",
  styleUrls: ["./hik-video.component.scss"],
})
export class HikVideoComponent implements AfterViewInit {
  @Input() cctv_id!: string

  isLoading = true
  url: string = ""

  constructor(private _service: HCMService) {}

  ngAfterViewInit(): void {
    this.isLoading = true
    this._service
      .getStreamingURL(this.cctv_id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((resp) => (this.url = resp.data.url))
  }
}
