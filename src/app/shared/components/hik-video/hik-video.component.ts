import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from "@angular/core"
import { finalize } from "rxjs"
import { HCMService } from "../../services/hcm.service"

@Component({
  selector: "app-hik-video",
  templateUrl: "./hik-video.component.html",
  styleUrls: ["./hik-video.component.scss"],
})
export class HikVideoComponent implements AfterViewInit {
  @Input() cctv_id?: string
  @Input() url?: string

  isLoading = false

  constructor(private _service: HCMService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.cctv_id && !this.url) {
      this.isLoading = true
      this._service
        .getStreamingURL(this.cctv_id)
        .pipe(
          finalize(() => {
            this.isLoading = false
            this.cdr.detectChanges()
          })
        )
        .subscribe((resp) => {
          this.url = resp.data.url
          this.cdr.detectChanges()
        })
    }
  }
}
