import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { format } from "date-fns"
import { map, Observable, of } from "rxjs"

import { environment } from "src/environments/environment"
import { VehicleData } from "./hcm.model"
import {
  CCTVData,
  HikCameraList,
  HikResponse,
  HIKService,
  HikStreamingURL,
} from "./hik.service"

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

@Injectable({
  providedIn: "root",
})
export class HCMService extends HIKService {
  streamType = 1

  constructor(protected override http: HttpClient) {
    const { appKey, appSecret, baseUrl } = environment.hikOpenapi.hcm
    super(http, appKey, appSecret, baseUrl)
  }

  getCameraList() {
    return this.postData<HikCameraList<HikCameraData>>(
      "/artemis/api/resource/v1/cameras",
      {
        pageNo: 1,
        pageSize: 20,
        treeCode: "0",
      }
    )
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
            ishcp: false,
          }
          return result
        })
      })
    )
  }

  getVehicleData(
    params: Record<string, string | null>,
    page: number,
    size: number
  ) {
    const theParams: Record<string, string | null> = {
      ...params,
      beginTime:
        format(new Date(params["startDate"] as string), "yyyy-MM-dd") +
        "T00:00:00.000+07:00",
      endTime:
        format(new Date(params["endDate"] as string), "yyyy-MM-dd") +
        "T00:00:00.000+07:00",
    }

    delete theParams["startDate"]
    delete theParams["endDate"]

    for (const key of Object.keys(theParams)) {
      if (!theParams[key]) {
        delete theParams[key]
      }
    }
    return this.postData<VehicleData>(
      "/artemis/api/aiapplication/v1/vehicle/data/query",
      {
        data: {
          ...theParams,
          queryType: "vehiclealarm",
        },
        metadata: {
          pageNo: page,
          pageSize: size,
        },
      }
    )
  }
}
