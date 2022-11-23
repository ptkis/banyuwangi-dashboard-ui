import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { map, Observable, of } from "rxjs"

import * as hmacSHA256 from "crypto-js/hmac-sha256"
import * as Base64 from "crypto-js/enc-base64"
import { v4 as uuidv4 } from "uuid"
import { environment } from "src/environments/environment"

export interface CCTVData {
  cctv_id: string
  cctv_title: string
  cctv_link?: string
  cctv_category?: string
  cctv_opd?: string
  cctv_latitude: string
  cctv_longitude: string
  cctv_status?: string
  cctv_desc?: string
  insert_timestamp?: string
  insert_user?: string
  update_timestamp?: string
  update_user?: string
}

interface HikResponse<T> {
  code: string
  msg: string
  data: T
}

interface HikCameraData {
  cameraIndexCode: string
  name: string
  unitIndexCode: string
  gbIndexCode: string
  deviceIndexCode: string
  latitude: string
  longitude: string
  altitude: string
  statusName: string
}
interface HikCameraList {
  list: HikCameraData[]
}

interface HikStreamingURL {
  url: string
}

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  appKey = environment.hikOpenapi.hcm.appKey
  appSecret = environment.hikOpenapi.hcm.appSecret
  baseUrl = environment.hikOpenapi.hcm.baseUrl

  streamType = 1

  constructor(private http: HttpClient) {}

  private _generateHeaders(url: string) {
    const timestamp = new Date().valueOf().toString()
    const uid = uuidv4()
    const message = `POST
*/*
application/json
x-ca-key:${this.appKey}
x-ca-nonce:${uid}
x-ca-timestamp:${timestamp}
${url}`

    const signature = Base64.stringify(hmacSHA256(message, this.appSecret))

    const headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "x-ca-timestamp": timestamp,
      "x-ca-nonce": uid,
      "x-ca-key": this.appKey,
      "x-ca-signature-headers": "x-ca-key,x-ca-nonce,x-ca-timestamp",
      "x-ca-signature": signature,
    }
    return headers
  }

  postData<T>(url: string, data: Record<string, any>) {
    return this.http.post<HikResponse<T>>(this.baseUrl + url, data, {
      headers: this._generateHeaders(url),
    })
  }

  getCameraList() {
    return this.postData<HikCameraList>("/artemis/api/resource/v1/cameras", {
      pageNo: 1,
      pageSize: 20,
      treeCode: "0",
    })
  }

  getStreamingURL(cctv_id: string) {
    return this.postData<HikStreamingURL>(
      "/artemis/api/video/v1/cameras/previewURLs",
      {
        cameraIndexCode: cctv_id,
        streamType: this.streamType,
        protocol: "hls",
        transmode: 0,
        expand: "transcode=0",
      }
    )
  }

  getCCTVData(): Observable<CCTVData[]> {
    const mapLonLat = [
      {
        cctv_latitude: "-8.2125175",
        cctv_longitude: "114.36960",
      },
      {
        cctv_latitude: "-8.2200597",
        cctv_longitude: "114.3664979",
      },
      {
        cctv_latitude: "-8.1993271",
        cctv_longitude: "114.3727973",
      },
      {
        cctv_latitude: "-8.238748",
        cctv_longitude: "114.3542172",
      },
      {
        cctv_latitude: "-8.37841253025448",
        cctv_longitude: "114.14263776566895",
      },
    ]

    return this.getCameraList().pipe(
      map((resp) => {
        return resp.data.list.map((dt, idx) => {
          const defLonLat = mapLonLat[idx]
          const result = {
            cctv_id: dt.cameraIndexCode,
            cctv_title: dt.name,
            cctv_latitude: dt.latitude || defLonLat.cctv_latitude,
            cctv_longitude: dt.longitude || defLonLat.cctv_longitude,
            cctv_status: dt.statusName,
          }
          return result
        })
      })
    )
    // return of([
    // {
    //   cctv_id: "129",
    //   cctv_title: "Simpang UST",
    //   cctv_link:
    //     "https://cctvjss.jogjakota.go.id/atcs/ATCS_UST.stream/playlist.m3u8",
    //   cctv_category: "1",
    //   cctv_opd: "16",
    //   cctv_latitude: "-8.37841253025448",
    //   cctv_longitude: "114.14263776566895",
    //   cctv_status: "0",
    //   cctv_desc: "Simpang UST",
    //   insert_timestamp: "2020-08-28 14:49:33",
    //   insert_user: "JSS-A0008",
    //   update_timestamp: "2022-10-12 11:24:06",
    //   update_user: "JSS-A0926",
    // },
    // ])
  }

  // getChartData() {
  //   return this.http.get<HikStreamingURL>(`${environment.serverBaseUrl}/v1/chart/trash?startDate=2022-04-01&endDate=2022-00-02`)
  // }
}
