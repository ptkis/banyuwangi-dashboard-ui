import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
  inject,
} from "@angular/core"
import { finalize, scan, takeWhile, tap, timer } from "rxjs"
import { HCMService } from "../../services/hcm.service"
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"
import {
  IHLSConfig,
  VgApiService,
  VgCoreModule,
} from "@videogular/ngx-videogular/core"
import { AppService } from "src/app/app.service"
import {
  VgHlsDirective,
  VgStreamingModule,
} from "@videogular/ngx-videogular/streaming"
import { environment } from "src/environments/environment"
import { CommonModule } from "@angular/common"
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering"
import { VgControlsModule } from "@videogular/ngx-videogular/controls"
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play"
import { TranslocoModule } from "@ngneat/transloco"
import { TuiLetModule } from "@taiga-ui/cdk"

@UntilDestroy()
@Component({
  selector: "app-hik-video-2",
  templateUrl: "./hik-video-2.component.html",
  styleUrls: ["./hik-video-2.component.scss"],
  standalone: true,
  imports: [
    CommonModule,

    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,
    TranslocoModule,
    TuiLetModule,
  ],
})
export class HikVideo2Component implements AfterViewInit {
  @Input() cctv_id?: string
  @Input() url?: string
  @Input() autoplay = true
  @Input() thumbnail: string | undefined

  @ViewChild("media")
  get videoEl() {
    return this._videoEl
  }

  set videoEl(v) {
    this._videoEl = v
    this.cdr.detectChanges()
  }

  _videoEl: ElementRef<HTMLVideoElement> | undefined

  @ViewChild("vgHls")
  set vgHls(directive: VgHlsDirective) {
    this.checkStatus(directive)
    this.hlsDirective = directive
    const media = directive?.target
    if (media) {
      media.muted = true
      if (sessionStorage.getItem("debug")) {
        media.controls = true
      }
    }
  }

  appService = inject(AppService)

  isLoading = false

  isError = false
  isHlsError = false
  isHlsLoading = false
  isReloading = false
  hlsMedia: HTMLVideoElement | undefined
  isReady = false

  hlsConfig: Partial<IHLSConfig> = {
    maxBufferLength: 1,
    maxMaxBufferLength: 1,
  }
  api: VgApiService | undefined

  hlsDirective: VgHlsDirective | undefined

  timer$ = timer(0, 1000).pipe(
    scan((acc) => --acc, environment.reloadErrorInterval),
    takeWhile((x) => x >= 0),
    tap((x) => {
      if (x === 0) {
        this.reloadPlayer()
        this.isHlsError = false
      }
    }),
    untilDestroyed(this)
  )

  healthChecktimer$ = timer(0, 1000).pipe(
    scan((acc) => --acc, environment.reloadHealthCheckInterval),
    takeWhile((x) => x >= 0),
    tap((x) => {
      if (x === 0) {
        this.reloadPlayer()
        this.isHlsError = false
      }
    }),
    untilDestroyed(this)
  )

  liveCheckTimer$ = timer(0, environment.liveCheckInterval * 1000).pipe(
    tap(() => {
      this.checkLive()
    }),
    untilDestroyed(this)
  )

  isDebug = false

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
          }),
          untilDestroyed(this)
        )
        .subscribe((resp) => {
          this.url = resp.data.url
          this.cdr.detectChanges()
        })
    }
    if (sessionStorage.getItem("debug")) {
      this.isDebug = true
    }
    // create a timer to check if the player is live
    this.liveCheckTimer$.subscribe()
  }

  reloadPlayer() {
    this.isReloading = true
    this.cdr.detectChanges()
    setTimeout(() => {
      this.isReloading = false
      this.cdr.detectChanges()
    }, 1000)
  }

  onPlayerReady(api: VgApiService) {
    this.isReady = true
    this.api = api
    setTimeout(() => {
      const video = this.videoEl?.nativeElement as HTMLVideoElement
      if (video) {
        video.muted = true
        const autoplay = video.play()
        if (autoplay) {
          autoplay.catch((err) => {
            if (this.isDebug) {
              console.error(err)
            }
          })
          setTimeout(() => {
            this.checkLive()
          }, 500)
        }
        if (sessionStorage.getItem("debug")) {
          video.controls = true
        }
      }
    }, 100)
  }

  checkStatus(directive: VgHlsDirective) {
    setTimeout(() => {
      if (directive) {
        // console.log(directive)
        const ev = {
          MEDIA_ATTACHING: "hlsMediaAttaching",
          MEDIA_ATTACHED: "hlsMediaAttached",
          MEDIA_DETACHING: "hlsMediaDetaching",
          MEDIA_DETACHED: "hlsMediaDetached",
          BUFFER_RESET: "hlsBufferReset",
          BUFFER_CODECS: "hlsBufferCodecs",
          BUFFER_CREATED: "hlsBufferCreated",
          BUFFER_APPENDING: "hlsBufferAppending",
          BUFFER_APPENDED: "hlsBufferAppended",
          BUFFER_EOS: "hlsBufferEos",
          BUFFER_FLUSHING: "hlsBufferFlushing",
          BUFFER_FLUSHED: "hlsBufferFlushed",
          MANIFEST_LOADING: "hlsManifestLoading",
          MANIFEST_LOADED: "hlsManifestLoaded",
          MANIFEST_PARSED: "hlsManifestParsed",
          LEVEL_SWITCHING: "hlsLevelSwitching",
          LEVEL_SWITCHED: "hlsLevelSwitched",
          LEVEL_LOADING: "hlsLevelLoading",
          LEVEL_LOADED: "hlsLevelLoaded",
          LEVEL_UPDATED: "hlsLevelUpdated",
          LEVEL_PTS_UPDATED: "hlsLevelPtsUpdated",
          LEVELS_UPDATED: "hlsLevelsUpdated",
          AUDIO_TRACKS_UPDATED: "hlsAudioTracksUpdated",
          AUDIO_TRACK_SWITCHING: "hlsAudioTrackSwitching",
          AUDIO_TRACK_SWITCHED: "hlsAudioTrackSwitched",
          AUDIO_TRACK_LOADING: "hlsAudioTrackLoading",
          AUDIO_TRACK_LOADED: "hlsAudioTrackLoaded",
          SUBTITLE_TRACKS_UPDATED: "hlsSubtitleTracksUpdated",
          SUBTITLE_TRACKS_CLEARED: "hlsSubtitleTracksCleared",
          SUBTITLE_TRACK_SWITCH: "hlsSubtitleTrackSwitch",
          SUBTITLE_TRACK_LOADING: "hlsSubtitleTrackLoading",
          SUBTITLE_TRACK_LOADED: "hlsSubtitleTrackLoaded",
          SUBTITLE_FRAG_PROCESSED: "hlsSubtitleFragProcessed",
          CUES_PARSED: "hlsCuesParsed",
          NON_NATIVE_TEXT_TRACKS_FOUND: "hlsNonNativeTextTracksFound",
          INIT_PTS_FOUND: "hlsInitPtsFound",
          FRAG_LOADING: "hlsFragLoading",
          FRAG_LOAD_EMERGENCY_ABORTED: "hlsFragLoadEmergencyAborted",
          FRAG_LOADED: "hlsFragLoaded",
          FRAG_DECRYPTED: "hlsFragDecrypted",
          FRAG_PARSING_INIT_SEGMENT: "hlsFragParsingInitSegment",
          FRAG_PARSING_USERDATA: "hlsFragParsingUserdata",
          FRAG_PARSING_METADATA: "hlsFragParsingMetadata",
          FRAG_PARSED: "hlsFragParsed",
          FRAG_BUFFERED: "hlsFragBuffered",
          FRAG_CHANGED: "hlsFragChanged",
          FPS_DROP: "hlsFpsDrop",
          FPS_DROP_LEVEL_CAPPING: "hlsFpsDropLevelCapping",
          ERROR: "hlsError",
          DESTROYING: "hlsDestroying",
          KEY_LOADING: "hlsKeyLoading",
          KEY_LOADED: "hlsKeyLoaded",
          LIVE_BACK_BUFFER_REACHED: "hlsLiveBackBufferReached",
          BACK_BUFFER_REACHED: "hlsBackBufferReached",
        }
        // for (const e of Object.keys(ev)) {
        //   directive.hls.on((ev as any)[e], (event: any, data: any) => {
        //     console.log(`HLS ${e}`, event, data)
        //   })
        // }
        directive.hls.on(ev.ERROR, (event: any, data: any) => {
          if (!!data.fatal) {
            // console.log(`HLS ${event}`, event, data)
            this.isHlsError = true
          }
        })
        directive.hls.on(ev.LEVEL_LOADING, (event: any, data: any) => {
          this.isHlsLoading = true
        })
        directive.hls.on(ev.LEVEL_LOADED, (event: any, data: any) => {
          this.isHlsLoading = false
        })
        directive.hls.on(ev.MEDIA_DETACHED, (event: any, data: any) => {
          // console.log(`HLS ${event}`, event, data)
          this.hlsMedia = undefined
        })
        // directive.hls.on(ev.BUFFER_EOS, (event: any, data: any) => {
        //   console.log(`HLS ${event}`, event, data)
        // })
        directive.hls.on(
          ev.MEDIA_ATTACHED,
          (event: any, data: { media: HTMLVideoElement }) => {
            const { media } = data
            media.muted = true
            const autoplay = media.play()
            if (autoplay) {
              autoplay.catch((err) => {
                if (this.isDebug) {
                  console.error(err)
                }
              })
              setTimeout(() => {
                this.checkLive()
              }, 500)
            }
            if (sessionStorage.getItem("debug")) {
              media.controls = true
            }
            this.hlsMedia = media
          }
        )
      }
    }, 100)
  }

  checkPlay() {
    if (this.hlsMedia && this.hlsMedia.paused) {
      console.log(this.hlsMedia?.paused)
      this.hlsMedia?.play()
    }
    setTimeout(() => {
      this.checkPlay()
    }, 2000)
  }

  isLive(): boolean {
    // This checks if the user is less than x seconds behind the live point
    if (this.hlsMedia) {
      if (this.isDebug) {
        console.log(
          "duration = ",
          this.hlsMedia.duration,
          "currentTime = ",
          this.hlsMedia.currentTime
        )
      }
      let diff1 = this.hlsMedia.duration - this.hlsMedia.currentTime
      return (
        diff1 < environment.liveCheckInterval ||
        diff1 > environment.liveCheckMaxDiff
      )
    }
    if (this.api) {
      if (this.isDebug) {
        console.log(
          "api duration = ",
          this.api.duration,
          "api currentTime = ",
          this.api.currentTime
        )
      }
      let diff1 = this.api.duration - this.api.currentTime
      return (
        diff1 < environment.liveCheckInterval ||
        diff1 > environment.liveCheckMaxDiff
      )
    }
    return false
  }

  checkLive() {
    // check go live
    if (this.isDebug) {
      console.log("check live")
    }
    if (!this.isLive()) {
      if (this.isDebug) {
        console.log("seeking to live")
      }
      if (
        this.hlsMedia &&
        this.hlsMedia.duration &&
        isFinite(this.hlsMedia.duration)
      ) {
        try {
          this.hlsMedia.currentTime =
            this.hlsMedia.duration - environment.liveCheckSeek
        } catch (error) {
          console.error("Failed to set currentTime:", error)
        }
      } else if (this.api && this.api.duration && isFinite(this.api.duration)) {
        try {
          let target = this.api.duration - environment.liveCheckSeek
          this.api.currentTime = target

          const api1 = this.api
          setTimeout(() => {
            if (api1.currentTime < target) {
              this.isHlsError = true
            }
          }, 1000)
        } catch (error) {
          console.error("Failed to set currentTime:", error)
        }
      }
    }
  }
}
