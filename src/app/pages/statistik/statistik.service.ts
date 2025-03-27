import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "src/environments/environment"
@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  constructor(private http: HttpClient) {}

  dataDetection(
    retry?: boolean,
    searchParams?: { [key: string]: string }
  ): Observable<any> {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
      }
    }

    return this.http.get<any>(
      `${environment.serverBaseUrl}/v1/detection/counts`,
      {
        params,
      }
    )
  }

  totalFlood(
    retry?: boolean,
    searchParams?: { [key: string]: string }
  ): Observable<any> {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
        type: "FLOOD",
        page: "0",
        size: "20",
      }
    }

    return this.http.get<any>(
      `${environment.serverBaseUrl}/v1/detection/counts`,
      {
        params,
      }
    )
  }

  totalTrash(
    retry?: boolean,
    searchParams?: { [key: string]: string }
  ): Observable<any> {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
        type: "TRASH",
        page: "0",
        size: "5000",
      }
    }

    return this.http.get<any>(
      `${environment.serverBaseUrl}/v1/detection/counts`,
      {
        params,
      }
    )
  }

  totalTraffict(
    retry?: boolean,
    searchParams?: { [key: string]: string }
  ): Observable<any> {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
        type: "TRAFFICT",
        page: "0",
        size: "5000",
      }
    }

    return this.http.get<any>(
      `${environment.serverBaseUrl}/v1/detection/counts`,
      {
        params,
      }
    )
  }
  totalStreetVendor(
    retry?: boolean,
    searchParams?: { [key: string]: string }
  ): Observable<any> {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
        type: "STREETVENDOR",
        page: "0",
        size: "5000",
      }
    }

    return this.http.get<any>(
      `${environment.serverBaseUrl}/v1/detection/counts`,
      {
        params,
      }
    )
  }
  totalCrowd(
    retry?: boolean,
    searchParams?: { [key: string]: string }
  ): Observable<any> {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
        type: "CROWD",
        page: "0",
        size: "5000",
      }
    }

    return this.http.get<any>(
      `${environment.serverBaseUrl}/v1/detection/counts`,
      {
        params,
      }
    )
  }

  getStatisticsFlood(
    retry?: boolean,
    searchParams?: { [key: string]: string }
  ): Observable<any> {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
      }
    }

    return this.http.get<any>(`${environment.serverBaseUrl}/v1/chart/total`, {
      params,
    })
  }

  getStatisticsTrash(
    retry?: boolean,
    searchParams?: { [key: string]: string }
  ): Observable<any> {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
      }
    }

    return this.http.get<any>(`${environment.serverBaseUrl}/v1/chart/total`, {
      params,
    })
  }

  getStatisticsTraffic(
    retry?: boolean,
    searchParams?: { [key: string]: string }
  ): Observable<any> {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
      }
    }

    return this.http.get<any>(`${environment.serverBaseUrl}/v1/chart/total`, {
      params,
    })
  }

  getStatisticsStreetVendor(
    retry?: boolean,
    searchParams?: { [key: string]: string }
  ): Observable<any> {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
      }
    }

    return this.http.get<any>(`${environment.serverBaseUrl}/v1/chart/total`, {
      params,
    })
  }

  getStatisticsCrowd(
    retry?: boolean,
    searchParams?: { [key: string]: string }
  ): Observable<any> {
    let params = {
      ...searchParams,
    }
    if (retry) {
      params = {
        ...params,
        rt: new Date().getTime() + "",
      }
    }

    return this.http.get<any>(`${environment.serverBaseUrl}/v1/chart/total`, {
      params,
    })
  }
}
