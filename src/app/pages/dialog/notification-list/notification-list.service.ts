import { HttpClient } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import { map, switchMap } from "rxjs"
import { APIResponse } from "src/app/shared/models/general.model"
import { environment } from "src/environments/environment"

export interface Notification {
  date: string
  instant: string
  location: string
  cameraName: string
  type: string
  value: number
  imageSrc: string
  annotations: any[]
}

@Injectable({
  providedIn: "root",
})
export class NotificationListService {
  http = inject(HttpClient)

  getNotificationList(params?: Record<string, any>) {
    return this.http
      .get<APIResponse<Notification[]>>(
        `${environment.serverBaseUrl}/v1/alarm/list`,
        {
          params,
        }
      )
      .pipe(
        switchMap((resp) => {
          return this.getNotificationCount(params).pipe(
            map((pagination) => {
              return {
                ...resp,
                pagination,
              }
            })
          )
        })
      )
  }

  getNotificationCount(params?: Record<string, any>) {
    return this.http.get<APIResponse<number>>(
      `${environment.serverBaseUrl}/v1/alarm/count`,
      {
        params,
      }
    )
  }
}
