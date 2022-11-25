import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core"
import { HCPService } from "../../services/hcp.service"

declare const JSPlugin: any

@Component({
  selector: "app-ws-video",
  templateUrl: "./ws-video.component.html",
  styleUrls: ["./ws-video.component.scss"],
})
export class WsVideoComponent implements AfterViewInit, OnDestroy {
  @Input() cctv_id!: string
  @Input() playerWidth = 400
  @Input() playerHeight = 267

  @Output() playStatus = new EventEmitter<boolean>()

  jsDecoder: any

  errorMessage = ""

  constructor(private _HCPService: HCPService) {}

  ngOnDestroy(): void {
    this.jsDecoder?.JS_Stop(0)
  }

  ngAfterViewInit(): void {
    this.jsDecoder = new JSPlugin({
      szId: "playWind",
      iType: 2,
      iWidth: this.playerWidth,
      iHeight: this.playerHeight,
      iMaxSplit: 1,
      iCurrentSplit: 1,
      szBasePath: "/assets/hcp/",
      oStyle: {
        border: "white",
        borderSelect: "white",
        background: "#4C4B4B",
      },
    })

    this._HCPService.getStreamingURL(this.cctv_id).subscribe((resp) => {
      if (resp.data.url) {
        this.realplay(resp.data.url)
      }
    })
  }

  realplay(curUrl: string) {
    // const curUrl = this.url
    let url = "",
      playUrl = ""

    if (!curUrl) {
      return false
    }

    const tempArr = curUrl.split("/")
    if (tempArr.length > 4) {
      url = "ws://" + tempArr[2] + "/" + "001"
      playUrl = tempArr[3] + "/" + tempArr[4]
    } else {
      // alert("The format of the Preview Url is incorrect.")
      return false
    }

    this.jsDecoder
      .JS_Play(
        url,
        {
          playURL: playUrl, //通道预览URL, 流媒体
          auth: "", //认证信息, 设备用户名&密码
          token: "", //token
        },
        0
      )
      .then(
        () => {
          this.playStatus.emit(true)
          console.log("realplay success")
        },
        (err: any) => {
          this.playStatus.emit(false)
          this.errorMessage =
            err?.["oError"]?.["statusString"] || "Realplay failed"
        }
      )
    return true
  }
}
