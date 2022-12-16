import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/environments/environment"
import { ListResponse, ResponseData } from "../dialog/cctvlist/cctvlist.service"

export interface ChartData {
  [key: string]: number[]
}
export interface ChartResponse {
  seriesNames: string[]
  labels: string[]
  data: ChartData
}

export interface ChartImageContent {
  date: string
  instant: string
  location: string
  cameraName: string
  type: string
  value: number
  imageSrc: string
  annotations: Annotation[]
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

  getDetectionChartData(
    pageNo: number,
    pageSize: number,
    searchParams?: { [key: string]: string }
  ) {
    let params = {
      type: "TRASH",
      page: pageNo - 1,
      size: pageSize,
      ...searchParams,
    }
    return this.http.get<ListResponse<ChartImageContent>>(
      `${environment.serverBaseUrl}/v1/detection/browse`,
      {
        params,
      }
    )
  }
}
