import { DialogModule } from "@angular/cdk/dialog"
import { ComponentFixture, TestBed } from "@angular/core/testing"
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
      ],
      providers: [
        {
          provide: DashboardService,
          useClass: MockDashboardService,
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

  it("should debug", () => {
    component.debugMode = true
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it("should test marker", () => {
    component.debugMode = true
    fixture.detectChanges()
    component.markers[0].openInfoWindow()
    expect(component.markers.length).toBe(1)
  })
})
