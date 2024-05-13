import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { map } from "rxjs"
import { environment } from "src/environments/environment"
import {
  ListResponse,
  ResponseData,
  SingleResponse,
} from "../dialog/cctvlist/cctvlist.service"

export interface ChartData {
  [key: string]: number[]
}
export interface ChartResponse {
  seriesNames: string[]
  labels: string[]
  data: ChartData
  snapshotIds: Record<string, string[]>
}

export interface ChartImageContent<T> {
  date: string
  instant: string
  location: string
  cameraName: string
  type: string
  value: number
  imageSrc: string
  annotations: T[]
}

export interface Annotation {
  boundingBox: BoundingBox
  confidence: number
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
  id: string
}

export interface AnnotationDataBySnapshotId extends Annotation {
  snapshotCreated?: string
  snapshotImageId?: string
  snapshotCameraLocation?: string
  name?: string
  type?: string
  id?: string
}

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getFloodChartData(retry?: boolean, searchParams?: { [key: string]: string }) {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
      }
    }
    return this.http.get<ChartResponse>(
      `${environment.serverBaseUrl}/v1/chart/flood`,
      {
        params,
      }
    )
  }

  getTrashChartData(retry?: boolean, searchParams?: { [key: string]: string }) {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
      }
    }
    return this.http.get<ChartResponse>(
      `${environment.serverBaseUrl}/v1/chart/trash`,
      {
        params,
      }
    )
  }

  getTrafficChartData(
    retry?: boolean,
    searchParams?: { [key: string]: string }
  ) {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
      }
    }
    return this.http.get<ChartResponse>(
      `${environment.serverBaseUrl}/v1/chart/traffic`,
      {
        params,
      }
    )
  }

  getStreetVendorChartData(
    retry?: boolean,
    searchParams?: { [key: string]: string }
  ) {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
      }
    }
    return this.http.get<ChartResponse>(
      `${environment.serverBaseUrl}/v1/chart/streetvendor`,
      {
        params,
      }
    )
  }

  getCrowdChartData(retry?: boolean, searchParams?: { [key: string]: string }) {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
      }
    }
    return this.http.get<ChartResponse>(
      `${environment.serverBaseUrl}/v1/chart/crowd`,
      {
        params,
      }
    )
  }

  getTotalChartData(retry?: boolean, searchParams?: { [key: string]: string }) {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
      }
    }
    return this.http.get<ChartResponse>(
      `${environment.serverBaseUrl}/v1/chart/total`,
      {
        params,
      }
    )
  }

  getDetectionChartData(
    pageNo: number,
    pageSize: number,
    searchParams?: { type: string | undefined }
  ) {
    let params = {
      type: "TRASH",
      page: pageNo - 1,
      size: pageSize,
      ...searchParams,
    }
    return this.http.get<ListResponse<ChartImageContent<Annotation>>>(
      `${environment.serverBaseUrl}/v1/detection/browse`,
      {
        params,
      }
    )
  }

  getDataBySnapshotId(snapshotid: string, type: string, value: string) {
    return this.http
      .get<SingleResponse<ChartImageContent<AnnotationDataBySnapshotId>>>(
        `${environment.serverBaseUrl}/v1/detection/id/${snapshotid}`,
        {
          params: {
            type,
            value,
          },
        }
      )
      .pipe(
        map((resp) => {
          return {
            ...resp,
            data: {
              ...resp.data,
              annotations: resp.data.annotations.filter((a) => a.type === type),
            },
          }
        })
      )
  }
}
