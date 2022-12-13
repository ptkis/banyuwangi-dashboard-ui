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
    "action",
  ]

  constructor(
    private _HCPService: HCPService,
    private _cctvService: CCTVListService,
    public dialog: Dialog,
    public modalService: ModalService,
    private router: Router,
    private zone: NgZone,
    private translocoService: TranslocoService
  ) {}

  ngAfterViewInit(): void {
    this.dialogRef = this.dialog.open<string, HTMLDivElement>(this.contentRef, {
      width: "1201px",
    })
    this.dialogRef.closed.subscribe(() => {
      this.zone.run(() => {
        this.router.navigate(["", { outlets: { dialog: null } }])
      })
    })

    this.getCCTVList()
  }

  getCCTVList(pageNo: number = 1, pageSize: number = 10) {
    const loaderRef = this.modalService.showLoader("Loading CCTV data...")
    this.isLoading = true
    this._cctvService
      .getCCTVData(pageNo, pageSize)
      .pipe(
        finalize(() => {
          loaderRef.close()
          this.isLoading = false
        })
      )
      .subscribe((resp) => {
        this.paginator = {
          index: resp.data.number,
          length: resp.data.totalElements,
          size: resp.data.numberOfElements,
        }
        this.dataSource = resp.data.content
      })
  }

  loadCCTVListPaginator() {
    this.getCCTVList(this.paginator.index + 1, this.paginator.size)
  }

  handlePageEvent(e: PageEvent) {
    this.getCCTVList(e.pageIndex + 1, e.pageSize)
  }

  importHCP(pageNo = 1, pageSize = 140) {
    this.isLoading = true
    const loaderRef = this.modalService.showLoader("Importing data...")
    this._HCPService
      .getCameraList(pageNo, pageSize)
      .pipe(
        finalize(() => {
          this.isLoading = false
          loaderRef.close()
        })
      )
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
              this._cctvService.postCCTVDataBulk(allBody).subscribe(() => {
                this.getCCTVList()
              })
            }
          })
        },
        error: (error: HttpErrorResponse) => {
          console.log({ error })
        },
      })
  }

  addData() {
    const dialogRef = this.dialog.open<CCTVData | null>(CCTVFormComponent, {
      width: "852px",
    })
    const component = dialogRef.componentInstance as CCTVFormComponent
    component.formSubmit.subscribe((formData) => {
      const loaderRef = this.modalService.showLoader("Saving data...")
      this.isLoading = true
      this._cctvService
        .postCCTVDataBulk([
          {
            ...formData,
            id: uuidv4(),
            version: undefined,
          },
        ])
        .pipe(
          finalize(() => {
            loaderRef.close()
            this.isLoading = false
          })
        )
        .subscribe(() => {
          this.loadCCTVListPaginator()
          dialogRef.close()
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
      const loaderRef = this.modalService.showLoader("Saving data...")
      this.isLoading = true
      const newData = {
        ...formData,
        version: (formData.version || 0) + 1,
      }
      this._cctvService
        .postCCTVData(newData)
        .pipe(
          finalize(() => {
            loaderRef.close()
            this.isLoading = false
          })
        )
        .subscribe(() => {
          this.loadCCTVListPaginator()
          dialogRef.close()
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
          const loaderRef = this.modalService.showLoader("Deleting data...")
          this.isLoading = true
          this._cctvService
            .deleteCCTVData(data.id!)
            .pipe(
              finalize(() => {
                loaderRef.close()
                this.isLoading = false
              })
            )
            .subscribe(() => {
              this.loadCCTVListPaginator()
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
