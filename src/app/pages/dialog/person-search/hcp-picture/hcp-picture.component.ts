import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core"
import { finalize } from "rxjs"
import { ReusableImageCanvasComponent } from "src/app/shared/components/reusable-image-canvas/reusable-image-canvas.component"
import { HCPService, PersonData } from "src/app/shared/services/hcp.service"

@Component({
  selector: "app-hcp-picture",
  templateUrl: "./hcp-picture.component.html",
  styleUrls: ["./hcp-picture.component.scss"],
})
export class HcpPictureComponent implements AfterViewInit {
  @Input() data: PersonData | null = null
  @Input() autoload = false
  @ViewChild(ReusableImageCanvasComponent)
  imageCanvasComponent!: ReusableImageCanvasComponent

  picData = ""
  isLoading = false
  isError = false

  constructor(private hcpService: HCPService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.autoload) {
      this.loadImage()
    }
  }

  loadImage() {
    if (this.data?.picUrl && !this.picData && !this.isLoading) {
      this.isLoading = true
      this.cdr.detectChanges()
      this.hcpService
        .getPic(this.data.picUrl)
        .pipe(
          finalize(() => {
            this.isLoading = false
            this.cdr.detectChanges()
          })
        )
        .subscribe({
          next: (res) => {
            setTimeout(() => {
              this.picData = `data:image/png;base64,${res.data.picData}`
              this.isError = false
              this.imageCanvasComponent.drawBGImage(this.picData)
            }, 0)
          },
          error: () => {
            this.isError = true
          },
        })
    }
  }

  imageLoaded() {
    this.imageCanvasComponent.drawRect(
      +(this.data?.pointX || 0),
      +(this.data?.pointY || 0),
      +(this.data?.width || 0),
      +(this.data?.height || 0)
    )
  }
}
