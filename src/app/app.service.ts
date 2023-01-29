import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Subject } from "rxjs"
import { environment } from "src/environments/environment"
import { ListResponse } from "./pages/dialog/cctvlist/cctvlist.service"
import { INotificationToastData } from "./shared/services/modal.service"

@Injectable({
  providedIn: "root",
})
export class AppService {
  notificationSubject$ = new Subject<INotificationToastData>()

  constructor(private http: HttpClient) {}

  storeDeviceToken(registrationToken: string) {
    return this.http.put<ListResponse<any>>(
      `${environment.serverBaseUrl}/v1/fcm/device/token/${registrationToken}`,
      {}
    )
  }
}
