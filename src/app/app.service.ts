import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "src/environments/environment"
import { ListResponse } from "./pages/dialog/cctvlist/cctvlist.service"

@Injectable({
  providedIn: "root",
})
export class AppService {
  constructor(private http: HttpClient) {}

  storeDeviceToken(registrationToken: string) {
    return this.http.put<ListResponse<any>>(
      `${environment.serverBaseUrl}/v1/fcm/device/token/${registrationToken}`,
      {}
    )
  }
}
