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
import { DashboardService } from "../dashboard.service"
import { of } from "rxjs"
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering"
import { VgControlsModule } from "@videogular/ngx-videogular/controls"
import { VgCoreModule } from "@videogular/ngx-videogular/core"
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play"
import { VgStreamingModule } from "@videogular/ngx-videogular/streaming"
import { Marker } from "maptalks"
import {
  API_URLS,
  HttpMocktInterceptor,
  IMockURLStructure,
} from "src/app/shared/services/http-mock-interceptor.service"
import { HTTP_INTERCEPTORS } from "@angular/common/http"

class MockDashboardService {
  getCCTVData() {
    return of([
      {
        cctv_title: "Malioboro_Perwakilan",
        cctv_link:
          "https://cctvjss.jogjakota.go.id/malioboro/Malioboro_5_Perwakilan.stream/playlist.m3u8",
        cctv_latitude: "-8.212201062367143",
        cctv_longitude: "114.3697169324405",
      },
    ])
  }
}

export const dashboardMockUrls: IMockURLStructure[] = [
  {
    urlRegex: /previewURLs/,
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
          },
        ],
      },
    },
  },
]

describe("MapDashboardComponent", () => {
  let component: MapDashboardComponent
  let fixture: ComponentFixture<MapDashboardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [dashboardComponents, dashboardDialogs],
      imports: [
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
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(MapDashboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it("should test marker", () => {
    fixture.detectChanges()
    component.markers[0].openInfoWindow()
    expect(component.markers.length).toBe(1)
  })

  it("should test map", () => {
    fixture.detectChanges()
    component.map.setPitch(0)
    component.markers[0].openInfoWindow()
    const scene = {
      add: () => {},
    }
    const camera = {
      add: () => {},
    }
    component.threeLayer?.prepareToDraw((callback: any) => {
      callback(null, scene, camera)
    })
    expect(component.markers.length).toBe(1)
  })
})
