import { HTTP_INTERCEPTORS } from "@angular/common/http"
import {
  IMockURLStructure,
  API_URLS,
  HttpMocktInterceptor,
} from "src/app/shared/services/http-mock-interceptor.service"
import * as chartResponse from "./chartResponse.json"

export const chartMockUrls: IMockURLStructure[] = [
  {
    urlRegex: /v1\/chart/i,
    json: chartResponse,
    delay: 2000,
  },
]

export const chartHttpMockProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpMocktInterceptor,
    multi: true,
  },
  {
    provide: API_URLS,
    useValue: chartMockUrls,
  },
]
