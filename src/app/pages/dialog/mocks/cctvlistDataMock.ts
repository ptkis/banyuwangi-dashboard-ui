import { HTTP_INTERCEPTORS } from "@angular/common/http"
import {
  IMockURLStructure,
  API_URLS,
  HttpMocktInterceptor,
} from "src/app/shared/services/http-mock-interceptor.service"
import * as cctvListResponse from "./cctvListResponse.json"

export const cctvMockUrls: IMockURLStructure[] = [
  {
    urlRegex: /v1\/camera\/bulk/i,
    json: {
      success: true,
    },
  },
  {
    urlRegex: /v1\/camera/i,
    json: cctvListResponse,
  },
]

export const cctvHttpMockProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpMocktInterceptor,
    multi: true,
  },
  {
    provide: API_URLS,
    useValue: cctvMockUrls,
  },
]
