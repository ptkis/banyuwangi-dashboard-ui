import { Dialog, DialogRef } from "@angular/cdk/dialog"
import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core"
import { WsVideoComponent } from "src/app/shared/components/ws-video/ws-video.component"

@Component({
  selector: "app-camera-view",
  templateUrl: "./camera-view.component.html",
  styleUrls: ["./camera-view.component.scss"],
})
export class CameraViewComponent implements AfterViewInit {
  @ViewChild("content") contentRef!: TemplateRef<HTMLDivElement>
  @ViewChild(WsVideoComponent) wsVideo!: WsVideoComponent

  dialogRef!: DialogRef<string>

  constructor(public dialog: Dialog) {}

  ngAfterViewInit(): void {
    this.dialogRef = this.dialog.open<string, HTMLDivElement>(this.contentRef, {
      width: "1201px",
    })
    // setTimeout(() => {
    //   const ids = [
    //     '926',
    //     '879',
    //     '923',
    //     '925',
    //     '927'
    //   ]
    //   for (const [idx, cctv_id] of ids.entries()) {
    //     this.wsVideo.getStreamingURL(cctv_id).subscribe(url => {
    //       if (typeof url === 'string') {
    //         this.wsVideo.realplay(url, idx + 1)
    //       }
    //     })
    //   }
    // }, 200)
  }
}
