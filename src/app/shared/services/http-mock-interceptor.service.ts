import { Injectable, InjectionToken, Optional, Inject } from "@angular/core"
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http"
import { Observable, of } from "rxjs"
import { tap, delay } from "rxjs/operators"

export interface IMockURLStructure {
  urlRegex: RegExp
  json?: any
  delay?: number
  cache?: boolean
}

export const API_URLS = new InjectionToken<IMockURLStructure>(
  "Pass API structure"
)

@Injectable()
export class HttpMocktInterceptor implements HttpInterceptor {
  reqCache = new Map<string, any>()

  constructor(
    @Optional() @Inject(API_URLS) private api_urls: IMockURLStructure[]
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const fullReqURL = request.urlWithParams

    if (this.api_urls?.length > 0) {
      const resp = this.api_urls.find((el) => {
        const matches = el.urlRegex.exec(fullReqURL)
        // if (!!matches) {
        //   console.info(matches)
        // }
        return !!matches
      })
      if (this.reqCache.has(fullReqURL) && resp?.cache !== false) {
        return of(this.reqCache.get(fullReqURL))
      }
      if (resp) {
        const body = resp.json["default"] || resp.json
        // console.info(`Request ${fullReqURL} intercepted by GlobalHttpMockRequestInterceptor`, {body})
        return of(new HttpResponse({ status: 200, body })).pipe(
          tap((resp) => this.reqCache.set(fullReqURL, resp))
        )
      }
    }
    return next.handle(request).pipe(
      tap((resp) => {
        this.reqCache.set(fullReqURL, resp)
        // console.info(`Request ${fullReqURL} bypassed by GlobalHttpMockRequestInterceptor`, {resp})
      })
    )
  }
}
