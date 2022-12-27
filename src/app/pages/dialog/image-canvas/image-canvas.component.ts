import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core"
import {
  Annotation,
  AnnotationDataBySnapshotId,
  ChartImageContent,
} from "../../dashboard/dashboard.service"

@Component({
  selector: "app-image-canvas",
  templateUrl: "./image-canvas.component.html",
  styleUrls: ["./image-canvas.component.scss"],
})
export class ImageCanvasComponent implements AfterViewInit {
  @Input() chartImageContent:
    | ChartImageContent<Annotation | AnnotationDataBySnapshotId>
    | undefined
  @Input() canvasWidth = 415
  @Input() canvasHeight = 233
  @Input() multiple = true

  @ViewChild("bgCanvas") bgCanvas!: ElementRef<HTMLCanvasElement>
  @ViewChild("canvas") canvas!: ElementRef<HTMLCanvasElement>

  bgContext!: CanvasRenderingContext2D | null
  context!: CanvasRenderingContext2D | null

  selected = false

  imgOriginalWidth = this.canvasWidth
  imgOriginalHeight = this.canvasHeight

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
    base_image.setAttribute("crossorigin", "anonymous")

    base_image.onload = () => {
      this.imgOriginalWidth = base_image.width
      this.imgOriginalHeight = base_image.height
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

  exportImage() {
    const tmpCanvas = document.createElement("canvas")
    // tmpCanvas.width = this.bgCanvas.nativeElement.width * 2
    // tmpCanvas.height = this.bgCanvas.nativeElement.height * 2
    tmpCanvas.width = this.imgOriginalWidth
    tmpCanvas.height = this.imgOriginalHeight

    const ctx = tmpCanvas.getContext("2d")
    const canvas = this.bgCanvas.nativeElement
    ctx!.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      tmpCanvas.width,
      tmpCanvas.height
    )
    ctx!.drawImage(
      this.canvas.nativeElement,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      tmpCanvas.width,
      tmpCanvas.height
    )
    // this.downloadURI(this.bgCanvas.nativeElement.toDataURL({ pixelRatio: 3 }), 'image.png')
    tmpCanvas.toBlob((blob) => {
      const anchor = document.createElement("a")
      anchor.download = `${this.chartImageContent?.instant}-${this.chartImageContent?.location}-${this.chartImageContent?.cameraName}.png`
      anchor.href = URL.createObjectURL(blob!)
      anchor.target = "_blank"

      anchor.click() // ✨ magic!

      URL.revokeObjectURL(anchor.href) // remove it from memory and save on memory! 😎
    }, "image/png")
  }
}
