import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/environments/environment"

export interface ChartData {
  [key: string]: number[]
}
export interface ChartResponse {
  seriesNames: string[]
  labels: string[]
  data: ChartData
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
}
