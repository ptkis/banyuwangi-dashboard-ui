import { DialogRef, Dialog } from "@angular/cdk/dialog"
import { HttpErrorResponse } from "@angular/common/http"
import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core"
import { FormControl, FormGroup } from "@angular/forms"
import { PageEvent } from "@angular/material/paginator"
import { Sort, SortDirection } from "@angular/material/sort"
import { ActivatedRoute, Router } from "@angular/router"
import { TRANSLOCO_SCOPE } from "@ngneat/transloco"
import { format } from "date-fns/esm"
import { ToastrService } from "ngx-toastr"
import { finalize } from "rxjs"
import { ModalService } from "src/app/shared/services/modal.service"
import { environment } from "src/environments/environment"
import { CCTVListService } from "../cctvlist/cctvlist.service"
import { SnapshotCount } from "../chart-image-single/chart-image-single.component"

const DATE_FORMAT = "yyyy-MM-dd"

@Component({
  selector: "app-chart-data",
  templateUrl: "./chart-data.component.html",
  styleUrls: ["./chart-data.component.scss"],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: "chartdata",
      multi: true,
    },
    {
      provide: TRANSLOCO_SCOPE,
      useValue: "dashboard",
      multi: true,
    },
  ],
})
export class ChartDataComponent implements AfterViewInit, OnInit {
  @ViewChild("content") contentRef!: TemplateRef<HTMLDivElement>

  isLoading = false
  dialogRef!: DialogRef<string>

  dataSource: SnapshotCount[] = []
  dataSourceAll: SnapshotCount[] = []
  paginator = {
    index: 0,
    length: 10,
    size: 20,
  }

  displayedColumns = [
    "position",
    "timestamp",
    "cameraName",
    "location",
    "latitude",
    "longitude",
    "type",
    "maxValue",
    "value",
  ]

  fieldMap: Record<string, string> = {
    timestamp: "SNAPSHOT_CREATED",
    cameraName: "SNAPSHOT_CAMERA_NAME",
    location: "SNAPSHOT_CAMERA_LOCATION",
    latitude: "SNAPSHOT_CAMERA_LATITUDE",
    longitude: "SNAPSHOT_CAMERA_LONGITUDE",
    type: "TYPE",
    maxValue: "MAXVALUE",
    value: "VALUE",
  }

  type: string | null = null
  camera: string | null = null
  startDate = format(new Date(), DATE_FORMAT)
  endDate = format(new Date(), DATE_FORMAT)
  direction = "DESC"
  sort = "SNAPSHOT_CREATED"
  sort_mat: string = "timestamp"
  direction_mat: SortDirection = "desc"

  searchForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    type: new FormControl<string | null>(null),
    camera: new FormControl<string | null>(null),
  })

  allDetection = ["crowd", "flood", "streetvendor", "traffic", "trash"]

  allCameras: string[] = []

  constructor(
    private _cctvService: CCTVListService,
    public dialog: Dialog,
    public modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const startDate = params.get("startDate")
      const endDate = params.get("endDate")
      this.type = params.get("type")
      this.camera = params.get("camera")
      this.direction = params.get("direction") || this.direction
      this.sort = params.get("sort") || this.sort

      if (startDate && endDate) {
        this.startDate = startDate
        this.endDate = endDate
      }

      this.getChartDataList()
    })
  }

  ngAfterViewInit(): void {
    this.dialog.closeAll()
    this.dialogRef = this.dialog.open<string, HTMLDivElement>(this.contentRef, {
      width: "1290px",
    })
    this.dialogRef.closed.subscribe(() => {
      this.zone.run(() => {
        this.router.navigate(["", { outlets: { dialog: null } }])
      })
    })
  }

  setLoading(loading: boolean, message?: string) {
    if (loading) {
      const loaderRef = this.modalService.showLoader(message)
      this.isLoading = true
      loaderRef.closed.subscribe(() => (this.isLoading = false))
      return loaderRef
    }
    this.isLoading = false
    return false
  }

  showError(message: string, title?: string) {
    return this.toastr.error(message, title || "Error", {
      timeOut: environment.toast.errorTimeout,
    })
  }

  getChartDataList(pageNo: number = 1, pageSize: number = 10) {
    const loaderRef = this.setLoading(true, "Loading Chart Data...")
    const params = {
      type: this.type?.toUpperCase() || null,
      startDate: this.startDate,
      endDate: this.endDate,
      camera: this.camera,
      direction: this.direction,
      sort: this.sort,
    }

    this.searchForm.setValue({
      camera: params.camera,
      type: params.type?.toLowerCase() || null,
      start: new Date(params.startDate),
      end: new Date(params.endDate),
    })

    this._cctvService
      .getChartData(pageNo, pageSize, params)
      .pipe(finalize(() => loaderRef && loaderRef.close()))
      .subscribe({
        next: (resp) => {
          this.paginator = {
            index: resp.data.number,
            length: resp.data.totalElements,
            size: resp.data.numberOfElements,
          }
          this.dataSource = resp.data.content
          this.allCameras = [
            ...new Set(this.dataSource.map((d) => d.snapshotCameraName)),
          ]
          this.setMatSortData()
        },
        error: (err: HttpErrorResponse) => {
          const message = err.error?.message || "Failed to load data"
          this.showError(message, "Network Error")
        },
      })
  }

  handlePageEvent(e: PageEvent) {
    this.getChartDataList(e.pageIndex + 1, e.pageSize)
  }

  exportData(e: Event) {
    e.preventDefault()
    const data = this.buildParams()
    this._cctvService.downloadExcel(1, 5000, data)
  }

  buildParams() {
    const { start, end, camera, type } = this.searchForm.value
    const data: Record<string, string> = {}
    if (start && end) {
      data["startDate"] = format(start, DATE_FORMAT)
      data["endDate"] = format(end, DATE_FORMAT)
    }
    if (camera) {
      data["camera"] = camera
    }
    if (type) {
      data["type"] = type
    }

    return data
  }

  search() {
    const data = this.buildParams()

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: data,
    })
  }

  sortChange(event: Sort) {
    this.direction = event.direction.toUpperCase()
    this.sort = this.fieldMap[event.active]
    this.getChartDataList(1, this.paginator.length)
  }

  setMatSortData() {
    const field = Object.keys(this.fieldMap).find(
      (key) => this.fieldMap[key] === this.sort
    )
    this.sort_mat = field || ""
    this.direction_mat = this.direction.toLowerCase() === "asc" ? "asc" : "desc"
  }
}
