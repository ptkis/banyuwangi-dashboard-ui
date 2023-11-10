import { HttpClient } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import { APIResponse } from "src/app/shared/models/general.model"
import { environment } from "src/environments/environment"

export interface CCTVData {
  vmsCameraIndexCode: null | string
  vmsType: string
  name: string
  location: string
  latitude: number
  longitude: number
  isActive: boolean
  isOnline: boolean
  isStreetvendor: boolean
  isTraffic: boolean
  isCrowd: boolean
  isTrash: boolean
  isFlood: boolean
  label: string
  liveViewUrl: null | string
}

@Injectable({
  providedIn: "root",
})
export class LiveService {
  http = inject(HttpClient)

  getCCTVList(params?: Record<string, any>) {
    return this.http.get<APIResponse<CCTVData[]>>(
      `${environment.serverBaseUrl}/v1/live/camera`,
      {
        params,
      }
    )
  }

  getLocationList(params?: Record<string, any>) {
    return this.http.get<APIResponse<string[]>>(
      `${environment.serverBaseUrl}/v1/live/location/list`,
      {
        params,
      }
    )
  }
}
