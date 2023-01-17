import { AfterViewInit, Component, Input } from "@angular/core"
import { finalize } from "rxjs"
import { HCPService, PersonData } from "../../services/hcp.service"

@Component({
  selector: "app-hcp-picture",
  templateUrl: "./hcp-picture.component.html",
  styleUrls: ["./hcp-picture.component.scss"],
})
export class HcpPictureComponent implements AfterViewInit {
  @Input() data: PersonData | null = null
  @Input() autoload = false

  picData = ""
  isLoading = false
  isError = false

  constructor(private hcpService: HCPService) {}

  ngAfterViewInit(): void {
    if (this.autoload) {
      this.loadImage()
    }
  }

  loadImage() {
    if (this.data?.picUrl && !this.picData && !this.isLoading) {
      this.isLoading = true
      this.hcpService
        .getPic(this.data.picUrl)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res) => {
            setTimeout(() => {
              this.picData = `data:image/png;base64,${res.data.picData}`
              this.isError = false
            }, 0)
          },
          error: () => {
            this.isError = true
          },
        })
    }
  }
}
