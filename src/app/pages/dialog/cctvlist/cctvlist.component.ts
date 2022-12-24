import { HttpErrorResponse } from "@angular/common/http"
import {
  AfterViewInit,
  Component,
  NgZone,
  TemplateRef,
  ViewChild,
} from "@angular/core"
import { finalize, forkJoin, take } from "rxjs"
import { HCPService } from "src/app/shared/services/hcp.service"
import { CCTVData, CCTVListService } from "./cctvlist.service"
import { v4 as uuidv4 } from "uuid"
import { PageEvent } from "@angular/material/paginator"
import { Dialog, DialogRef } from "@angular/cdk/dialog"
import { CCTVFormComponent } from "../cctvform/cctvform.component"
import { ModalService } from "src/app/shared/services/modal.service"
import { Router } from "@angular/router"
import { TranslocoService, TRANSLOCO_SCOPE } from "@ngneat/transloco"
import { ToastrService } from "ngx-toastr"

const TRANSLATE_SCOPE = "cctvlist"

@Component({
  selector: "app-cctvlist",
  templateUrl: "./cctvlist.component.html",
  styleUrls: ["./cctvlist.component.scss"],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: TRANSLATE_SCOPE }],
})
export class CCTVListComponent implements AfterViewInit {
  @ViewChild("content") contentRef!: TemplateRef<HTMLDivElement>

  isLoading = false
  dialogRef!: DialogRef<string>

  dataSource: CCTVData[] = []
  dataSourceAll: CCTVData[] = []
  paginator = {
    index: 0,
    length: 10,
    size: 20,
  }

  displayedColumns = [
    "position",
    // 'vmsCameraIndexCode',
    "name",
    "location",
    "latitude",
    "longitude",
    "host",
    "httpPort",
    "rtspPort",
    // 'userName',
    // 'password',
    // 'isActive',
    // 'isLiveView',
    // 'isCrowd',
    // 'isFlood',
    // 'isStreetVendor',
    // 'isTraffic',
    // 'isTrash',
    "maxFlood",
    "maxTrash",
    "maxStreetvendor",
    "maxCrowd",
    "maxTraffic",
    "action",
  ]

  constructor(
    private _HCPService: HCPService,
    private _cctvService: CCTVListService,
    public dialog: Dialog,
    public modalService: ModalService,
    private router: Router,
    private zone: NgZone,
    private translocoService: TranslocoService,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit(): void {
    this.dialogRef = this.dialog.open<string, HTMLDivElement>(this.contentRef, {
      width: "1290px",
    })
    this.dialogRef.closed.subscribe(() => {
      this.zone.run(() => {
        this.router.navigate(["", { outlets: { dialog: null } }])
      })
    })

    this.getCCTVList()
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
      disableTimeOut: true,
    })
  }

  getCCTVList(pageNo: number = 1, pageSize: number = 10) {
    const loaderRef = this.setLoading(true, "Loading CCTV data...")
    this._cctvService
      .getCCTVData(pageNo, pageSize)
      .pipe(finalize(() => loaderRef && loaderRef.close()))
      .subscribe({
        next: (resp) => {
          this.paginator = {
            index: resp.data.number,
            length: resp.data.totalElements,
            size: resp.data.numberOfElements,
          }
          this.dataSource = resp.data.content
        },
        error: (err: HttpErrorResponse) => {
          const message = err.error?.message || "Failed to load data"
          this.showError(message, "Network Error")
        },
      })
  }

  loadCCTVListPaginator() {
    this.getCCTVList(this.paginator.index + 1, this.paginator.size)
  }

  handlePageEvent(e: PageEvent) {
    this.getCCTVList(e.pageIndex + 1, e.pageSize)
  }

  importHCP(pageNo = 1, pageSize = 140) {
    const loaderRef = this.setLoading(true, "Importing data...")
    this._HCPService
      .getCameraList(pageNo, pageSize)
      .pipe(finalize(() => loaderRef && loaderRef.close()))
      .subscribe({
        next: (resp) => {
          this._cctvService.getCCTVData(1, 10000).subscribe((cctvResp) => {
            const data = resp.data.list
            const allBody = []
            // const allData = this.dataSource
            const allData = cctvResp.data.content
            for (const dt of data) {
              const existingData = allData.find(
                (d) => d.vmsCameraIndexCode === dt.cameraIndexCode
              )
              const body = {
                id: existingData?.id || uuidv4(),
                version: existingData ? (existingData.version || 0) + 1 : null,
                vmsCameraIndexCode: dt.cameraIndexCode,
                host: dt.encodeDeviceData?.data.encodeDevIp,
                httpPort: dt.encodeDeviceData?.data.encodeDevPort,
                // location: dt.encodeDeviceData?.data.encodeDevName,
                location: existingData?.location || "",
                name: existingData?.name || dt.cameraName,
                channel: existingData?.channel || 0,
                isActive: existingData?.isActive || true,
                isCrowd: existingData?.isCrowd || false,
                isFlood: existingData?.isFlood || false,
                isStreetvendor: existingData?.isStreetvendor || false,
                isTraffic: existingData?.isTraffic || false,
                isTrash: existingData?.isTrash || false,
                latitude: existingData?.latitude || 0,
                longitude: existingData?.longitude || 0,
                password: existingData?.password || "",
                rtspPort: existingData?.rtspPort || 0,
                userName: existingData?.userName || "",
                vmsType: existingData?.vmsType || "HCP",
                captureQualityChannel:
                  existingData?.captureQualityChannel || "",
                type: existingData?.type || "HIKVISION",
                label: existingData?.label || "",
              }
              // if (!existingData) {
              //   allBody.push(body)
              // }
              allBody.push(body)
            }
            if (allBody.length) {
              this._cctvService.postCCTVDataBulk(allBody).subscribe({
                next: () => {
                  this.getCCTVList()
                },
                error: (error: HttpErrorResponse) => {
                  const message = error.error?.message || "Server Error"
                  this.showError(message, "Failed to import data")
                },
              })
            }
          })
        },
        error: (error: HttpErrorResponse) => {
          const message = error.error?.message || "Server Error"
          this.showError(message, "Failed to import data")
        },
      })
  }

  addData() {
    const dialogRef = this.dialog.open<CCTVData | null>(CCTVFormComponent, {
      width: "852px",
    })
    const component = dialogRef.componentInstance as CCTVFormComponent
    component.formSubmit.subscribe((formData) => {
      const loaderRef = this.setLoading(true, "Saving data...")
      this._cctvService
        .postCCTVDataBulk([
          {
            ...formData,
            id: uuidv4(),
            version: undefined,
          },
        ])
        .pipe(finalize(() => loaderRef && loaderRef.close()))
        .subscribe({
          next: () => {
            this.loadCCTVListPaginator()
            dialogRef.close()
          },
          error: (error: HttpErrorResponse) => {
            const message = error.error?.message || "Server Error"
            this.showError(message, "Failed to add data")
          },
        })
    })
  }

  editData(data: CCTVData) {
    const dialogRef = this.dialog.open<CCTVData | null>(CCTVFormComponent, {
      data: {
        row: data,
      },
      width: "852px",
    })
    const component = dialogRef.componentInstance as CCTVFormComponent
    component.formSubmit.subscribe((formData) => {
      const loaderRef = this.setLoading(true, "Saving data...")
      const newData = {
        ...formData,
        version: (formData.version || 0) + 1,
      }
      this._cctvService
        .postCCTVData(newData)
        .pipe(finalize(() => loaderRef && loaderRef.close()))
        .subscribe({
          next: () => {
            this.loadCCTVListPaginator()
            dialogRef.close()
          },
          error: (error: HttpErrorResponse) => {
            const message = error.error?.message || "Server Error"
            this.showError(message, "Failed to edit data")
          },
        })
    })
  }

  deleteData(data: CCTVData) {
    forkJoin({
      title: this.translocoService
        .selectTranslate(
          "delete.title",
          {
            ...data,
          },
          TRANSLATE_SCOPE
        )
        .pipe(take(1)),
      message: this.translocoService
        .selectTranslate(
          "delete.message",
          {
            ...data,
          },
          TRANSLATE_SCOPE
        )
        .pipe(take(1)),
      btnConfirm: this.translocoService
        .selectTranslate("delete.btnConfirm", {}, TRANSLATE_SCOPE)
        .pipe(take(1)),
      btnCancel: this.translocoService
        .selectTranslate("delete.btnCancel", {}, TRANSLATE_SCOPE)
        .pipe(take(1)),
    }).subscribe(({ title, message, btnConfirm, btnCancel }) => {
      const dialogRef = this.modalService.showConfirm(
        message,
        title,
        btnConfirm,
        btnCancel
      )
      dialogRef.closed.subscribe((res) => {
        if (res) {
          const loaderRef = this.setLoading(true, "Deleting data...")
          this._cctvService
            .deleteCCTVData(data.id!)
            .pipe(finalize(() => loaderRef && loaderRef.close()))
            .subscribe({
              next: () => {
                this.loadCCTVListPaginator()
              },
              error: (error: HttpErrorResponse) => {
                const message = error.error?.message || "Server Error"
                this.showError(message, "Failed to delete data")
              },
            })
        }
      })
    })
  }

  viewData(data: CCTVData) {
    this.dialog.open(CCTVFormComponent, {
      data: {
        row: data,
        readonly: true,
      },
      width: "852px",
    })
  }
}
