import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { BehaviorSubject, Subject } from "rxjs"
import { environment } from "src/environments/environment"
import { ListResponse } from "./pages/dialog/cctvlist/cctvlist.service"
import { INotificationToastData } from "./shared/services/modal.service"

@Injectable({
  providedIn: "root",
})
export class AppService {
  notificationSubject$ = new Subject<INotificationToastData>()
  cctvIdHasAlerts$ = new BehaviorSubject<string[]>([])

  idHasAlerts: string[] = []

  constructor(private http: HttpClient) {}

  storeDeviceToken(registrationToken: string) {
    return this.http.put<ListResponse<any>>(
      `${environment.serverBaseUrl}/v1/fcm/device/token/${registrationToken}`,
      {}
    )
  }

  addAlertToId(id: string) {
    this.idHasAlerts = [...this.idHasAlerts, id]

    this.cctvIdHasAlerts$.next(this.idHasAlerts)
  }

  removeAlertFromId(id: string) {
    this.idHasAlerts = this.idHasAlerts.filter((id2) => id2 !== id)
    this.cctvIdHasAlerts$.next(this.idHasAlerts)
  }
}
