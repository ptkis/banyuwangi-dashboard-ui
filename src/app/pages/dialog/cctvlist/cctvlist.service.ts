import { HttpClient } from "@angular/common/http"
import { Injectable, Optional } from "@angular/core"
import { TranslocoService } from "@ngneat/transloco"
import { finalize, map, of, Subject, switchMap } from "rxjs"
import { ModalService } from "src/app/shared/services/modal.service"
import { environment } from "src/environments/environment"
import { utils, writeFile } from "xlsx"
import { SnapshotCount } from "../chart-image-single/chart-image-single.component"

export interface CCTVData {
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
  isLoginSucceeded?: boolean
  isLiveView?: boolean
  label: string
  lastCaptureMethod?: string
  isPing?: boolean
  pingResponseTimeSec?: number
  pingRawData?: string
  pingLast?: any
  id?: string
  version: number | null | undefined
  alarmSetting?: AlarmSetting
}

export interface AlarmSetting {
  maxFlood: number | null
  maxTrash: number | null
  maxStreetvendor: number | null
  maxCrowd: number | null
  maxTraffic: number | null
}

export interface Sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface Pageable {
  sort: Sort
  offset: number
  pageNumber: number
  pageSize: number
  paged: boolean
  unpaged: boolean
}

export interface ResponseData<T> {
  content: T[]
  pageable: Pageable
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: Sort
  numberOfElements: number
  first: boolean
  empty: boolean
}

export interface ListResponse<T> {
  success: boolean
  message: string
  data: ResponseData<T>
}

export interface SingleResponse<T> {
  success: boolean
  message: string
  data: T
}

@Injectable({
  providedIn: "root",
})
export class CCTVListService {
  dirtyData = new Subject()

  constructor(
    private http: HttpClient,
    private translocoService: TranslocoService,
    @Optional() private modalService: ModalService
  ) {}

  getCCTVData(pageNo: number, pageSize: number) {
    return this.http.get<ListResponse<CCTVData>>(
      `${environment.serverBaseUrl}/v1/camera`,
      {
        params: {
          page: pageNo - 1,
          size: pageSize,
        },
      }
    )
  }

  postCCTVData(data: CCTVData) {
    return this.http.post<any>(`${environment.serverBaseUrl}/v1/camera`, data)
  }

  postCCTVDataBulk(data: CCTVData[]) {
    return this.http.post<any>(
      `${environment.serverBaseUrl}/v1/camera/bulk`,
      data
    )
  }

  deleteCCTVData(id: string) {
    return this.http.post<any>(
      `${environment.serverBaseUrl}/v1/camera/bulk/delete`,
      [id]
    )
  }

  getChartData(
    pageNo: number,
    pageSize: number,
    params: Record<string, string | null>
  ) {
    const filteredParams: Record<string, string | null> = {}

    for (const key of Object.keys(params)) {
      if (params[key] !== null) {
        filteredParams[key] = params[key]
      }
    }

    return this.http.get<ListResponse<SnapshotCount>>(
      `${environment.serverBaseUrl}/v1/detection/counts`,
      {
        params: {
          page: pageNo - 1,
          size: pageSize,
          ...filteredParams,
        },
      }
    )
  }

  getEcelChartData(
    pageNo: number,
    pageSize: number,
    params: Record<string, string | null>
  ) {
    return this.translocoService.selectTranslate("No", {}, "chartdata").pipe(
      switchMap(() => {
        return this.translocoService
          .selectTranslate("all", {}, "dashboard")
          .pipe(
            switchMap(() => {
              return this.getChartData(pageNo, pageSize, params).pipe(
                map((resp) => {
                  const data = resp.data.content
                  if (data) {
                    return data.map((row, idx) => {
                      return {
                        [this.translocoService.translate("chartdata.No")]:
                          idx + 1,
                        [this.translocoService.translate(
                          "chartdata.timestamp"
                        )]: row.snapshotCreated,
                        [this.translocoService.translate("chartdata.Name")]:
                          row.snapshotCameraName,
                        [this.translocoService.translate("chartdata.Location")]:
                          row.snapshotCameraLocation,
                        [this.translocoService.translate("chartdata.Latitude")]:
                          row.snapshotCameraLatitude,
                        [this.translocoService.translate(
                          "chartdata.Longitude"
                        )]: row.snapshotCameraLongitude,
                        [this.translocoService.translate("chartdata.type")]:
                          row.type,
                        [this.translocoService.translate("chartdata.maxValue", {
                          type: this.translocoService.translate(
                            "dashboard." +
                              (params["type"] || "all").toLowerCase()
                          ),
                        })]: row.maxValue,
                        [this.translocoService.translate("chartdata.value", {
                          type: this.translocoService.translate(
                            "dashboard." +
                              (params["type"] || "all").toLowerCase()
                          ),
                        })]: row.value,
                      }
                    })
                  }
                  return []
                })
              )
            })
          )
      })
    )
  }

  downloadExcel(
    pageNo: number,
    pageSize: number,
    params: Record<string, string | null>
  ) {
    const chartType = params["type"] || "all"
    return this.translocoService
      .selectTranslate(chartType, {}, "dashboard")
      .subscribe({
        next: (typeTranslate) => {
          const dialogRef = this.modalService.showLoader("Preparing data...")
          this.getEcelChartData(pageNo, pageSize, {
            ...params,
            type: chartType !== "all" ? chartType.toUpperCase() : null,
          })
            .pipe(finalize(() => dialogRef.close()))
            .subscribe((resp) => {
              const worksheet = utils.json_to_sheet(resp)
              // const csv = utils.sheet_to_csv(sheet)
              const workbook = utils.book_new()
              utils.book_append_sheet(workbook, worksheet, `${typeTranslate}`)
              writeFile(workbook, `${typeTranslate}.xlsx`)
            })
        },
      })
  }
}
