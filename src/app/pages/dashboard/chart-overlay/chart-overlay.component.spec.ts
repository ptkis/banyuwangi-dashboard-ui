import { ComponentFixture, TestBed } from "@angular/core/testing"
import { NgxEchartsModule } from "ngx-echarts"
import { SharedModule } from "src/app/shared/shared.module"

import { ChartOverlayComponent } from "./chart-overlay.component"

import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"

describe("ChartOverlayComponent", () => {
  let component: ChartOverlayComponent
  let fixture: ComponentFixture<ChartOverlayComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartOverlayComponent],
      imports: [
        SharedModule,
        NgxEchartsModule.forRoot({
          // echarts
          echarts: () => import("echarts"),
        }),
        MatButtonModule,
        MatIconModule,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ChartOverlayComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
