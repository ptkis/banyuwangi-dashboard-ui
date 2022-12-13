import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { NgxEchartsModule } from "ngx-echarts"

import { DashboardComponent } from "./dashboard.component"
import { SharedModule } from "../../shared/shared.module"

import { dashboardComponents } from "."
import { dashboardDialogs } from "./dialogs"
import { RouterTestingModule } from "@angular/router/testing"
import { dashboardMaterialModules } from "./dashboard.module"

describe("DashboardComponent", () => {
  let component: DashboardComponent
  let fixture: ComponentFixture<DashboardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [dashboardComponents, dashboardDialogs],
      imports: [
        SharedModule,
        NgxEchartsModule.forRoot({
          // echarts
          echarts: () => import("echarts"),
        }),
        RouterTestingModule,
        dashboardMaterialModules,
        HttpClientTestingModule,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DashboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
