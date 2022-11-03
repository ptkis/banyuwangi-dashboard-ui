import { ComponentFixture, TestBed } from "@angular/core/testing"
import { NgxEchartsModule } from "ngx-echarts"

import { DashboardComponent } from "./dashboard.component"
import { SharedModule } from "../../shared/shared.module"

import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { DialogModule } from "@angular/cdk/dialog"
import { dashboardComponents } from "."
import { dashboardDialogs } from "./dialogs"
import { RouterTestingModule } from "@angular/router/testing"

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
        MatButtonModule,
        MatIconModule,
        DialogModule,
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
