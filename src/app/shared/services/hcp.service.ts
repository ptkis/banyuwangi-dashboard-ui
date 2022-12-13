import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import {
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  toArray,
} from "rxjs"

import { environment } from "src/environments/environment"
import {
  CCTVData,
  HikCameraList,
  HikResponse,
  HIKService,
  HikStreamingURL,
} from "./hik.service"

export interface HCPEncodeDeviceData {
  encodeDevIndexCode: string
  encodeDevName: string
  encodeDevIp: string
  encodeDevPort: string
  encodeDevCode: string
  treatyType: string
  status: number
}

export interface HCPHikCameraData {
  cameraIndexCode: string
  cameraName: string
  capabilitySet: string
  devResourceType: string
  encodeDevIndexCode: string
  recordType: string
  recordLocation: string
  regionIndexCode: string
  siteIndexCode: string
  status: number
  encodeDeviceData?: HikResponse<HCPEncodeDeviceData>
}

const statusMap = ["Unknown", "Online", "Offline"]

@Injectable({
  providedIn: "root",
})
export class HCPService extends HIKService {
  streamType = 1

  constructor(protected override http: HttpClient) {
    const { appKey, appSecret, baseUrl } = environment.hikOpenapi.hcp
    super(http, appKey, appSecret, baseUrl)
  }

  getCameraList(pageNo = 1, pageSize = 40) {
    return this.postData<HikCameraList<HCPHikCameraData>>(
      "/artemis/api/resource/v1/cameras",
      {
        pageNo,
        pageSize,
        siteIndexCode: "0",
        deviceType: "encodeDevice",
      }
    ).pipe(
      switchMap((resp) =>
        forkJoin([
          ...resp.data.list.map((cctv) =>
            this.getEncodeDeiviceInfo(cctv.encodeDevIndexCode)
          ),
        ]).pipe(
          map((encodeResp) => ({
            ...resp,
            data: {
              ...resp.data,
              list: [
                ...resp.data.list.map((cctv) => {
                  return {
                    ...cctv,
                    encodeDeviceData: encodeResp.find(
                      (d) =>
                        d.data.encodeDevIndexCode === cctv.encodeDevIndexCode
                    ),
                  }
                }),
              ],
            },
          }))
        )
      )
    )
  }

  getEncodeDeiviceInfo(encodeDevIndexCode: string) {
    return this.postData<any>(
      "/artemis/api/resource/v1/encodeDevice/indexCode/encodeDeviceInfo",
      {
        encodeDevIndexCode,
      }
    )
  }

  getStreamingURL(cctv_id: string) {
    return this.postData<HikStreamingURL>(
      "/artemis/api/video/v1/cameras/previewURLs",
      {
        cameraIndexCode: cctv_id,
        streamType: this.streamType,
        protocol: "websocket",
        transmode: 1,
        requestWebsocketProtocol: 0,
      }
    )
  }

  getCCTVData(): Observable<CCTVData[]> {
    const mapLonLat = [
      [-8.171682395733185, 114.26786868427104],
      [-8.09227234125523, 114.18503627141628],
      [-8.33390581831106, 114.17806091033377],
      [-7.974691059347178, 114.27758281228472],
      [-8.561232373664033, 114.35072505222071],
      [-8.503865077922237, 114.10607687036591],
      [-8.738267936349263, 114.52223099413955],
      [-8.253098840197836, 114.3702920556287],
      [-8.23481635787733, 114.38658146083402],
      [-8.225303816278977, 114.35374207359351],
      [-8.226209782417362, 114.32124595520052],
      [-8.243422745419773, 114.3223901848109],
      [-8.210921326723193, 114.32330556842761],
      [-8.246706712497579, 114.30728635513532],
      [-8.264371722234227, 114.31930076510454],
      [-8.290414845107705, 114.35866226063939],
      [-8.27931842132666, 114.31254981120054],
      [-8.30909689324174, 114.29675944385914],
      [-8.322003969998619, 114.26529313203497],
      [-8.334118120408741, 114.283143112609],
      [-8.297095195329955, 114.33966805077495],
      [-8.293019063524325, 114.34516035247516],
      [-8.332985972457852, 114.30843058485493],
      [-8.310795217178711, 114.291610410898],
      [-8.339665596326334, 114.30671424057361],
      [-8.311134881068323, 114.27776523378806],
      [-8.312380312805455, 114.26403447953751],
      [-8.328446312490609, 114.22928746329556],
      [-8.022428167681507, 114.18838624389616],
      [-8.162486600396, 114.12708380147266],
      [-8.438775812038548, 113.91516158366157],
      [-8.557344181621627, 113.93484413386672],
      [-8.366201057558172, 113.93663345661264],
      [-8.544958159652474, 113.96347329780147],
      [-8.49364036036758, 114.0690433398109],
      [-8.52372404342135, 114.21934645046841],
      [-8.454705034534985, 114.28734071481347],
      [-8.601576681490794, 114.3374417516993],
      [-8.325482462761434, 113.97957720251479],
      [-8.44585554767011, 114.11556573120491],
    ]

    return this.getCameraList().pipe(
      map((resp) => {
        return resp.data.list.map((dt, idx) => {
          const defLonLat = mapLonLat[idx]
          const result = {
            cctv_id: dt.cameraIndexCode,
            cctv_title: dt.cameraName,
            cctv_latitude: defLonLat[0] + "",
            cctv_longitude: defLonLat[1] + "",
            cctv_status: statusMap[dt.status],
            ishcp: true,
          }
          return result
        })
      })
    )
  }
}
