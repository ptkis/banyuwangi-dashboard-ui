import { Dialog, DialogRef } from "@angular/cdk/dialog"
import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { TRANSLOCO_SCOPE } from "@ngneat/transloco"
import { ChartImageContent } from "../../dashboard/dashboard.service"

export interface NotificationData {
  maxValue: number
  snapshotCount: SnapshotCount
  id: string
}

export interface SnapshotCount {
  snapshot: Snapshot
  snapshotCreated: string
  snapshotImageId: string
  snapshotCameraName: string
  snapshotCameraLocation: string
  type: string
  value: number
  id: string
}

export interface Snapshot {
  imageId: string
  camera: Camera
  length: number
  isAnnotation: boolean
  id: string
}

export interface Camera {
  vmsCameraIndexCode: string
  vmsType: string
  name: string
  location: string
  latitude: number
  longitude: number
  host: string
  httpPort: number
  rtspPort: number
  channel: number
  captureQualityChannel: string
  userName: string
  password: string
  isActive: boolean
  isStreetvendor: boolean
  isTraffic: boolean
  isCrowd: boolean
  isTrash: boolean
  isFlood: boolean
  type: string
  label: string
  alarmSetting: AlarmSetting
  id: string
}

export interface AlarmSetting {
  maxFlood: null
  maxTrash: null
  maxStreetvendor: null
  maxCrowd: number
  maxTraffic: number
}

@Component({
  selector: "app-chart-image-single",
  templateUrl: "./chart-image-single.component.html",
  styleUrls: ["./chart-image-single.component.scss"],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: "dashboard" }],
})
export class ChartImageSingleComponent implements AfterViewInit, OnInit {
  @ViewChild("content") contentRef!: TemplateRef<HTMLDivElement>

  isLoading = false
  dialogRef!: DialogRef<string>
  imageData!: ChartImageContent
  type = "trash"

  canvasWidth = 415
  canvasHeight = 233

  constructor(
    public dialog: Dialog,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((param) => {
      const data = param.get("data")
      const imageSrc = param.get("imageSrc")
      if (data && imageSrc) {
        this.loadData(JSON.parse(data), imageSrc)
      }
    })
  }

  ngAfterViewInit(): void {
    this.dialogRef = this.dialog.open<string, HTMLDivElement>(this.contentRef, {
      // width: "1127px",
    })
    this.dialogRef.closed.subscribe(() => {
      this.zone.run(() => {
        this.router.navigate(["", { outlets: { dialog: null } }])
      })
    })
  }

  loadData(data: NotificationData, imageSrc: string) {
    this.type = data.snapshotCount.type?.toLowerCase()
    this.imageData = {
      cameraName: data.snapshotCount.snapshotCameraName,
      date: data.snapshotCount.snapshotCreated,
      annotations: [],
      location: data.snapshotCount.snapshotCameraLocation,
      imageSrc,
      type: data.snapshotCount.type,
      value: data.snapshotCount.value,
      instant: data.snapshotCount.snapshotCreated,
    }
  }
}
