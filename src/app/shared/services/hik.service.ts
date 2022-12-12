import { HttpClient } from "@angular/common/http"

import hmacSHA256 from "crypto-js/hmac-sha256"
import Base64 from "crypto-js/enc-base64"
import { v4 as uuidv4 } from "uuid"

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
  ishcp: boolean
}

export interface HikResponse<T> {
  code: string
  msg: string
  data: T
}

export interface HikCameraList<T> {
  list: T[]
  pageNo: number
  pageSize: number
  total: number
}

export interface HikStreamingURL {
  url: string
}

export class HIKService {
  appKey: string
  appSecret: string
  baseUrl: string

  constructor(
    protected http: HttpClient,
    appKey: string,
    appSecret: string,
    baseUrl: string
  ) {
    this.appKey = appKey
    this.appSecret = appSecret
    this.baseUrl = baseUrl
  }

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
}
