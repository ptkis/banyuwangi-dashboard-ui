import { HTTP_INTERCEPTORS } from "@angular/common/http"
import {
  IMockURLStructure,
  API_URLS,
  HttpMocktInterceptor,
} from "src/app/shared/services/http-mock-interceptor.service"
import * as cctvListResponse from "./cctvListResponse.json"
import * as hcpResponse from "./hcpResponse.json"
import * as hcmVehicle from "./hcmVehicle.json"

export const cctvMockUrls: IMockURLStructure[] = [
  {
    urlRegex: /encodeDeviceInfo/i,
    json: {
      code: "0",
      msg: "Success",
      data: {
        encodeDevIndexCode: "150",
        encodeDevName: "PALDAM2",
        encodeDevIp: "10.101.39.242",
        encodeDevPort: "80",
        encodeDevCode: "0046b8118914",
        treatyType: "onvif_net",
        status: 1,
      },
    },
  },
  {
    urlRegex: /artemis\/api\/resource\/v1\/cameras/,
    json: hcpResponse,
  },
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
  {
    urlRegex: /v1\/vehicle\/data\/query/i,
    json: hcmVehicle,
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
