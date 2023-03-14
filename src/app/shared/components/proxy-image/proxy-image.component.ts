import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import { HCMService } from "../../services/hcm.service"

@Component({
  selector: "app-proxy-image",
  imports: [CommonModule],
  standalone: true,
  templateUrl: "./proxy-image.component.html",
  styleUrls: ["./proxy-image.component.scss"],
})
export class ProxyImageComponent implements AfterViewInit {
  @Input() url = ""

  isLoading = false
  isError = false
  imageUrl = ""

  constructor(
    private _HCMService: HCMService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    if (this.url) {
      this.isLoading = true
      this.cdr.detectChanges()
      let newUrl = this.url
      newUrl = newUrl.replace(/^https?:\/\//, "http://") // Replace https with http
      newUrl = newUrl.replace(/:6113\b/, ":6120") // Replace port 6113 with 6120

      this._HCMService.getImageFromProxy(newUrl).subscribe({
        next: (response) => {
          // console.log(response['body'])
          const reader = new FileReader()
          reader.readAsDataURL(response)
          reader.onloadend = () => {
            this.imageUrl = reader.result as string
          }
          this.isError = false
          this.isLoading = false
          this.cdr.detectChanges()
        },
        error: (err: any) => {
          console.error(err)
          this.isError = true
          this.isLoading = false
          this.cdr.detectChanges()
        },
      })
    }
  }
}
