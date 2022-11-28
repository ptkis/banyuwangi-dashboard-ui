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

  getTrashChartData() {
    return this.http.get<ChartResponse>(
      `${environment.serverBaseUrl}/v1/chart/trash`
    )
  }
}
