import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core"
import { map } from "rxjs"
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
  @Input() maxSplit = 1

  @Output() playStatus = new EventEmitter<boolean>()

  jsDecoder: any

  errorMessage = ""
  id = ""

  constructor(private _HCPService: HCPService) {
    this.id = this.makeid(5)
  }

  ngOnDestroy(): void {
    try {
      this.jsDecoder.JS_Stop(0)
    } catch (error) {}
  }

  makeid(length: number) {
    let result = ""
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  ngAfterViewInit(): void {
    this.jsDecoder = new JSPlugin({
      szId: "playWind" + this.id,
      iType: 2,
      iWidth: this.playerWidth,
      iHeight: this.playerHeight,
      iMaxSplit: this.maxSplit,
      iCurrentSplit: 1,
      szBasePath: "/assets/hcp/",
      oStyle: {
        border: "white",
        borderSelect: "white",
        background: "#4C4B4B",
      },
    })

    this.getStreamingURL(this.cctv_id).subscribe((url) => {
      if (typeof url === "string") {
        this.realplay(url, 0)
      }
    })
  }

  getStreamingURL(cctv_id: string) {
    return this._HCPService.getStreamingURL(cctv_id).pipe(
      map((resp) => {
        if (resp.data.url) {
          return resp.data.url
        }
        return resp
      })
    )
  }

  realplay(curUrl: string, windowIdx = 0) {
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
        windowIdx
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
