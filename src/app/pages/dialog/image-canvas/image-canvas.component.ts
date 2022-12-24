import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core"
import { ChartImageContent } from "../../dashboard/dashboard.service"

@Component({
  selector: "app-image-canvas",
  templateUrl: "./image-canvas.component.html",
  styleUrls: ["./image-canvas.component.scss"],
})
export class ImageCanvasComponent implements AfterViewInit {
  @Input() chartImageContent: ChartImageContent | undefined
  @Input() canvasWidth = 415
  @Input() canvasHeight = 233

  @ViewChild("bgCanvas") bgCanvas!: ElementRef<HTMLCanvasElement>
  @ViewChild("canvas") canvas!: ElementRef<HTMLCanvasElement>

  bgContext!: CanvasRenderingContext2D | null
  context!: CanvasRenderingContext2D | null

  constructor() {}

  ngAfterViewInit(): void {
    this.bgContext = this.bgCanvas.nativeElement.getContext("2d")
    this.context = this.canvas.nativeElement.getContext("2d")
    const imageUrl = this.chartImageContent?.imageSrc
    if (this.bgContext && imageUrl) {
      this.drawBGImage(imageUrl)
    }
    if (this.context) {
      const annotationData = this.chartImageContent?.annotations
      if (annotationData?.length) {
        for (const ann of annotationData) {
          const boundingRect = ann.boundingBox
          this.drawRect(
            boundingRect.x,
            boundingRect.y,
            boundingRect.width,
            boundingRect.height
          )
        }
      }
    }
  }

  drawBGImage(imageUrl: string) {
    const base_image = new Image()
    base_image.src = imageUrl
    base_image.onload = () => {
      this.bgContext!.drawImage(
        base_image,
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      )
    }
  }

  drawRect(x: number, y: number, width: number, height: number) {
    if (this.context) {
      this.context.beginPath()
      this.context.strokeStyle = "#9fed1a"
      this.context.rect(
        x * this.canvasWidth,
        y * this.canvasHeight,
        width * this.canvasWidth,
        height * this.canvasHeight
      )
      this.context.stroke()
    }
  }
}
