import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-reusable-image-canvas",
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, FormsModule],
  templateUrl: "./reusable-image-canvas.component.html",
  styleUrls: ["./reusable-image-canvas.component.scss"],
})
export class ReusableImageCanvasComponent implements AfterViewInit {
  @Input() canvasWidth = 415
  @Input() canvasHeight = 233
  @Input() showCheckbox = true

  @Output() imageLoaded = new EventEmitter<boolean>()

  @ViewChild("bgCanvas") bgCanvas!: ElementRef<HTMLCanvasElement>
  @ViewChild("canvas") canvas!: ElementRef<HTMLCanvasElement>

  bgContext!: CanvasRenderingContext2D | null
  context!: CanvasRenderingContext2D | null

  selected = false

  constructor() {}

  ngAfterViewInit(): void {
    this.bgContext = this.bgCanvas.nativeElement.getContext("2d")
    this.context = this.canvas.nativeElement.getContext("2d")
  }

  drawBGImage(imageUrl: string) {
    const base_image = new Image()
    base_image.src = imageUrl
    base_image.setAttribute("crossorigin", "anonymous")

    base_image.onload = () => {
      this.canvasWidth = base_image.width
      this.canvasHeight = base_image.height
      setTimeout(() => {
        this.bgContext!.drawImage(
          base_image,
          0,
          0,
          this.canvasWidth,
          this.canvasHeight
        )
        this.imageLoaded.emit(true)
      }, 0)
    }
  }

  drawRect(x: number, y: number, width: number, height: number) {
    if (this.context) {
      this.context.beginPath()
      this.context.strokeStyle = "#9fed1a"
      this.context.lineWidth = 3
      this.context.rect(
        x * this.canvasWidth,
        y * this.canvasHeight,
        width * this.canvasWidth,
        height * this.canvasHeight
      )
      this.context.stroke()
    }
  }

  exportImage(filename: string) {
    const tmpCanvas = document.createElement("canvas")
    // tmpCanvas.width = this.bgCanvas.nativeElement.width * 2
    // tmpCanvas.height = this.bgCanvas.nativeElement.height * 2
    tmpCanvas.width = this.canvasWidth
    tmpCanvas.height = this.canvasHeight

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
      anchor.download = `${filename}.png`
      anchor.href = URL.createObjectURL(blob!)
      anchor.target = "_blank"

      anchor.click() // ✨ magic!

      URL.revokeObjectURL(anchor.href) // remove it from memory and save on memory! 😎
    }, "image/png")
  }
}
