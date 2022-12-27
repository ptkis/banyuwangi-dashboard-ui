import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Subject } from "rxjs"
import { environment } from "src/environments/environment"
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

  constructor(private http: HttpClient) {}

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
}
