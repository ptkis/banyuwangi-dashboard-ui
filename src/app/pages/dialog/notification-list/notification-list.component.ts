import { Dialog, DialogRef } from "@angular/cdk/dialog"
import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { ToastrService } from "ngx-toastr"
import { finalize } from "rxjs"
import { NotificationListService } from "src/app/pages/dialog/notification-list/notification-list.service"
import { ModalService } from "src/app/shared/services/modal.service"
import { environment } from "src/environments/environment"
import { type Notification } from "./notification-list.service"
import { HttpErrorResponse } from "@angular/common/http"
import { PageEvent } from "@angular/material/paginator"

@Component({
  selector: "app-notification-list",
  templateUrl: "./notification-list.component.html",
  styleUrls: ["./notification-list.component.scss"],
})
export class NotificationListComponent implements AfterViewInit, OnInit {
  @ViewChild("content") contentRef!: TemplateRef<HTMLDivElement>

  service = inject(NotificationListService)
  isLoading = false
  dialogRef!: DialogRef<string>

  dataSource: Notification[] = []
  dataSourceAll: Notification[] = []
  paginator = {
    index: 0,
    length: 10,
    size: 10,
  }

  displayedColumns = ["date", "type", "camera", "latlon"]

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

  constructor(
    public dialog: Dialog,
    public modalService: ModalService,
    private router: Router,
    private zone: NgZone,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
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
    const loaderRef = this.setLoading(true, "Loading Notification Data...")

    this.service
      .getNotificationList({
        size: pageSize,
        page: pageNo - 1,
      })
      .pipe(finalize(() => loaderRef && loaderRef.close()))
      .subscribe({
        next: (resp) => {
          this.dataSource = resp.data
          this.paginator = {
            ...this.paginator,
            length: resp.pagination?.data || this.paginator.length,
            size: pageSize,
          }
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
}
