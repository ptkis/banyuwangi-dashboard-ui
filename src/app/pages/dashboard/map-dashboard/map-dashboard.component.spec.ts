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
import { of } from "rxjs"
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
        ToastrModule.forRoot(),
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

  // it("should create", () => {
  //   fixture.detectChanges()
  //   expect(component).toBeTruthy()
  // })

  // it("should test marker", () => {
  //   fixture.detectChanges()
  //   console.log(component.markers?.length)
  //   try {
  //     component.markers[0].openInfoWindow()
  //   } catch (error) {}
  //   expect(component.markers.length).toBe(2)
  // })

  it("should test map", async () => {
    fixture.detectChanges()
    // component.map.setPitch(0)
    // try {
    //   component.markers[0].openInfoWindow()
    // } catch (error) {}
    // const scene = {
    //   add: () => {},
    // }
    // const camera = {
    //   add: () => {},
    // }
    // component.threeLayer?.prepareToDraw((callback: any) => {
    //   callback(null, scene, camera)
    // })
    await fixture.whenStable()
    expect(component.markers.length).toBe(2)
  })
})
