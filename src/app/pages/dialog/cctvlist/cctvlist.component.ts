import { HttpErrorResponse } from "@angular/common/http"
import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core"
import { finalize } from "rxjs"
import { HCPService } from "src/app/shared/services/hcp.service"
import { CCTVData, CCTVListService } from "./cctvlist.service"
import { v4 as uuidv4 } from "uuid"
import { PageEvent } from "@angular/material/paginator"
import { Dialog, DialogRef } from "@angular/cdk/dialog"
import { CCTVFormComponent } from "../cctvform/cctvform.component"
import { ModalService } from "src/app/shared/services/modal.service"
import { Router } from "@angular/router"

@Component({
  selector: "app-cctvlist",
  templateUrl: "./cctvlist.component.html",
  styleUrls: ["./cctvlist.component.scss"],
})
export class CCTVListComponent implements OnInit, AfterViewInit {
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
    private modalService: ModalService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.getCCTVList()
  }

  ngAfterViewInit(): void {
    this.dialogRef = this.dialog.open<string, HTMLDivElement>(this.contentRef, {
      width: "1201px",
    })
    this.dialogRef.closed.subscribe(() => {
      this.zone.run(() => {
        this.router.navigate(["", { outlets: { dialog: null } }])
      })
    })
  }

  rowClick(row: CCTVData) {}

  getCCTVList(pageNo: number = 1, pageSize: number = 10) {
    this._cctvService.getCCTVData(pageNo, pageSize).subscribe((resp) => {
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
    const dialogRef = this.modalService.showConfirm(
      "Do you want to delete this data?",
      `Delete ${data.name}?`
    )
    dialogRef.closed.subscribe((res) => {
      if (res) {
        const loaderRef = this.modalService.showLoader("Saving data...")
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
