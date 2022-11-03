import { DialogModule } from "@angular/cdk/dialog"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { RouterTestingModule } from "@angular/router/testing"
import { NgxEchartsModule } from "ngx-echarts"
import { SharedModule } from "src/app/shared/shared.module"
import { dashboardComponents } from ".."
import { dashboardDialogs } from "../dialogs"

import { Map3dDashboardComponent } from "./map3d-dashboard.component"

import { NoopAnimationsModule } from "@angular/platform-browser/animations"

describe("Map3dDashboardComponent", () => {
  let component: Map3dDashboardComponent
  let fixture: ComponentFixture<Map3dDashboardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(Map3dDashboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should open dialog kendaraan", async () => {
    fixture.componentInstance.openDialogKendaraan()

    fixture.detectChanges()
    const dialogContainerElement = document.querySelector(
      "cdk-dialog-container"
    )!
    expect(dialogContainerElement.getAttribute("role")).toBe("dialog")
    expect(dialogContainerElement.getAttribute("aria-modal")).toBe("true")
  })

  it("should open dialog orang", async () => {
    fixture.componentInstance.openDialogOrang()

    fixture.detectChanges()
    const dialogContainerElement = document.querySelector(
      "cdk-dialog-container"
    )!
    expect(dialogContainerElement.getAttribute("role")).toBe("dialog")
    expect(dialogContainerElement.getAttribute("aria-modal")).toBe("true")
  })
})
