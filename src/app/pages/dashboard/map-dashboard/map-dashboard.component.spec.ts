import { DialogModule } from "@angular/cdk/dialog"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { RouterTestingModule } from "@angular/router/testing"
import { NgxEchartsModule } from "ngx-echarts"
import { SharedModule } from "src/app/shared/shared.module"
import { dashboardComponents } from ".."
import { dashboardDialogs } from "../dialogs"

import { MapDashboardComponent } from "./map-dashboard.component"
import { of, throwError } from "rxjs"
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering"
import { VgControlsModule } from "@videogular/ngx-videogular/controls"
import { VgCoreModule } from "@videogular/ngx-videogular/core"
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play"
import { VgStreamingModule } from "@videogular/ngx-videogular/streaming"
import {
  API_URLS,
  HttpMocktInterceptor,
  IMockURLStructure,
} from "src/app/shared/services/http-mock-interceptor.service"
import { HTTP_INTERCEPTORS } from "@angular/common/http"

import { ToastrModule } from "ngx-toastr"
import { environment } from "src/environments/environment"
import { FormsModule } from "@angular/forms"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"

import { render, screen, fireEvent, waitFor } from "@testing-library/angular"
import { DashboardService } from "../dashboard.service"
import { HCPService } from "src/app/shared/services/hcp.service"
import { HCMService } from "src/app/shared/services/hcm.service"

export const dashboardMockUrls: IMockURLStructure[] = [
  {
    urlRegex: new RegExp(environment.hikOpenapi.hcm.baseUrl + ".+?previewURLs"),
    cache: false,
    json: {
      code: "0",
      msg: "ok",
      data: {
        url: "localhost",
      },
    },
  },
  {
    urlRegex: new RegExp(environment.hikOpenapi.hcp.baseUrl + ".+?previewURLs"),
    cache: false,
    json: {
      code: "0",
      msg: "ok",
      data: {
        url: "ws://192.168.256.3/SMSEurl/AbcDEF/fdfd/sdf",
      },
    },
  },
  {
    urlRegex: /cameras$/,
    json: {
      code: "0",
      msg: "ok",
      data: {
        list: [
          {
            name: "test",
            latitude: "0",
            longitude: "0",
            statusName: "Offline",
          },
          {
            name: "test 2 without latlong",
          },
        ],
      },
    },
  },
]

jest.setTimeout(30000)

describe("MapDashboardComponent", () => {
  const renderComponent = async (providers: any[] = []) => {
    return await render(MapDashboardComponent, {
      declarations: [dashboardComponents, dashboardDialogs],
      imports: [
        NoopAnimationsModule,
        DialogModule,
        RouterTestingModule,
        SharedModule,
        NgxEchartsModule.forRoot({
          // echarts
          echarts: () => import("echarts"),
        }),
        RouterTestingModule,
        MatButtonModule,
        MatIconModule,

        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        VgStreamingModule,

        HttpClientTestingModule,
        ToastrModule.forRoot(),

        FormsModule,
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpMocktInterceptor,
          multi: true,
        },
        {
          provide: API_URLS,
          useValue: dashboardMockUrls,
        },
        ...providers,
      ],
    })
  }

  it("should test map", async () => {
    const res = await renderComponent()
    const fixture = res.fixture
    const component = fixture.componentInstance
    fixture.detectChanges()
    component.map.setPitch(0)
    for (const marker of component.markers) {
      marker.openInfoWindow()
    }
    // await fixture.whenStable()
    const scene = {
      add: () => {},
    }
    const camera = {
      add: () => {},
    }
    component.threeLayer?.prepareToDraw.apply(
      (callback: any) => {
        callback(null, scene, camera)
      },
      [null, scene, camera]
    )
    expect(component.markers.length).toBe(2)
  })

  it("should test error response", async () => {
    class mockHCPService {
      getCCTVData() {
        return throwError(() => ({ statusText: "Error" }))
      }
    }
    const res = await renderComponent([
      {
        provide: HCPService,
        useClass: mockHCPService,
      },
      {
        provide: HCMService,
        useClass: mockHCPService,
      },
    ])
    const fixture = res.fixture
    const component = fixture.componentInstance
    fixture.detectChanges()
    expect(component.markers.length).toBe(0)
  })
})
