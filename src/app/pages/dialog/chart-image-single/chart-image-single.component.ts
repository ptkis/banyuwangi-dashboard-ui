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
import { finalize } from "rxjs"
import {
  Annotation,
  AnnotationDataBySnapshotId,
  ChartImageContent,
  DashboardService,
} from "../../dashboard/dashboard.service"
import { CCTVData } from "../cctvlist/cctvlist.service"

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
  camera: CCTVData
  length: number
  isAnnotation: boolean
  id: string
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
  imageData!: ChartImageContent<Annotation>
  imageDataCanvas!: ChartImageContent<AnnotationDataBySnapshotId>
  type = "trash"
  useImageCanvas = false

  canvasWidth = 415
  canvasHeight = 233

  constructor(
    public dialog: Dialog,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((param) => {
      const data = param.get("data")
      const imageSrc = param.get("imageSrc")
      const snapshotid = param.get("snapshotid")
      const type = param.get("type")?.toUpperCase()
      const value = param.get("value")
      if (data && imageSrc) {
        this.loadData(JSON.parse(data), imageSrc)
        this.useImageCanvas = false
      } else if (snapshotid && type && value) {
        this.loadDataFromSnapshot(snapshotid, type, value)
        this.useImageCanvas = true
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
      annotations: [...Array(10)],
      location: data.snapshotCount.snapshotCameraLocation,
      imageSrc,
      type: data.snapshotCount.type,
      value: data.snapshotCount.value,
      instant: data.snapshotCount.snapshotCreated,
    }
  }

  loadDataFromSnapshot(snapshotid: string, type: string, value: string) {
    this.isLoading = true
    this.dashboardService
      .getDataBySnapshotId(snapshotid, type, value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((resp) => {
        this.imageDataCanvas = resp.data
      })
  }
}
