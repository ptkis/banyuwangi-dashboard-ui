import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"

export interface CCTVData {
  cctv_id: string
  cctv_title: string
  cctv_link: string
  cctv_category: string
  cctv_opd: string
  cctv_latitude: string
  cctv_longitude: string
  cctv_status: string
  cctv_desc: string
  insert_timestamp: string
  insert_user: string
  update_timestamp: string
  update_user: string
}

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor() {}

  getCCTVData(): Observable<CCTVData[]> {
    return of([
      {
        cctv_id: "91",
        cctv_title: "Malioboro_Perwakilan",
        cctv_link:
          "https://cctvjss.jogjakota.go.id/malioboro/Malioboro_5_Perwakilan.stream/playlist.m3u8",
        cctv_category: "3",
        cctv_opd: "108",
        cctv_latitude: "-8.212201062367143",
        cctv_longitude: "114.3697169324405",
        cctv_status: "0",
        cctv_desc: "Jl. Perwakilan",
        insert_timestamp: "2020-08-04 09:38:09",
        insert_user: "JSS-A0008",
        update_timestamp: "2022-10-19 10:50:42",
        update_user: "JSS-A0926",
      },
      {
        cctv_id: "92",
        cctv_title: "Malioboro_Mall_Utara",
        cctv_link:
          "https://cctvjss.jogjakota.go.id/malioboro/Malioboro_6_Mall_Utara.stream/playlist.m3u8",
        cctv_category: "3",
        cctv_opd: "108",
        cctv_latitude: "-8.216699969227932",
        cctv_longitude: "114.37744376884848",
        cctv_status: "0",
        cctv_desc: "Malioboro Mall Sisi Utara",
        insert_timestamp: "2020-08-04 09:43:13",
        insert_user: "JSS-A0008",
        update_timestamp: "2022-09-12 10:41:05",
        update_user: "JSS-A0926",
      },
      {
        cctv_id: "93",
        cctv_title: "Malioboro_Mall_Selatan",
        cctv_link:
          "https://cctvjss.jogjakota.go.id/malioboro/Malioboro_7_Mall_Selatan.stream/playlist.m3u8",
        cctv_category: "3",
        cctv_opd: "108",
        cctv_latitude: "-8.224933685504567",
        cctv_longitude: "114.37306522821723",
        cctv_status: "0",
        cctv_desc: "Malioboro Mall Sisi Selatan",
        insert_timestamp: "2020-08-04 09:46:16",
        insert_user: "JSS-A0008",
        update_timestamp: "2022-09-12 10:41:09",
        update_user: "JSS-A0926",
      },
      {
        cctv_id: "94",
        cctv_title: "Malioboro_Pasar_Beringharjo",
        cctv_link:
          "https://cctvjss.jogjakota.go.id/malioboro/Malioboro_30_Pasar_Beringharjo.stream/playlist.m3u8",
        cctv_category: "3",
        cctv_opd: "108",
        cctv_latitude: "-8.231639369308624",
        cctv_longitude: "114.3728076670036",
        cctv_status: "0",
        cctv_desc: "Pasar Beringharjo",
        insert_timestamp: "2020-08-04 09:51:04",
        insert_user: "JSS-A0008",
        update_timestamp: "2022-09-12 10:41:14",
        update_user: "JSS-A0926",
      },
      {
        cctv_id: "129",
        cctv_title: "Simpang UST",
        cctv_link:
          "https://cctvjss.jogjakota.go.id/atcs/ATCS_UST.stream/playlist.m3u8",
        cctv_category: "1",
        cctv_opd: "16",
        cctv_latitude: "-8.37841253025448",
        cctv_longitude: "114.14263776566895",
        cctv_status: "0",
        cctv_desc: "Simpang UST",
        insert_timestamp: "2020-08-28 14:49:33",
        insert_user: "JSS-A0008",
        update_timestamp: "2022-10-12 11:24:06",
        update_user: "JSS-A0926",
      },
    ])
  }
}
