import { ComponentFixture, TestBed } from "@angular/core/testing"

import { ChartOverlayComponent } from "./chart-overlay.component"

import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { RouterTestingModule } from "@angular/router/testing"
import {
  chartComponents,
  chartImportedModules,
  chartProviders,
} from "./chart-components"
import { HarnessLoader } from "@angular/cdk/testing"
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed"
import { MatButtonHarness } from "@angular/material/button/testing"
import { MatCheckboxHarness } from "@angular/material/checkbox/testing"
import { MatInputHarness } from "@angular/material/input/testing"
import { MatMenuItemHarness } from "@angular/material/menu/testing"
import { DashboardService } from "../dashboard.service"
import { HttpClient } from "@angular/common/http"
import { HttpTestingController } from "@angular/common/http/testing"

describe("ChartOverlayComponent", () => {
  let component: ChartOverlayComponent
  let fixture: ComponentFixture<ChartOverlayComponent>
  let rootLoader: HarnessLoader
  let service: DashboardService

  let httpClient: HttpClient
  let httpTestingController: HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartOverlayComponent, chartComponents],
      imports: [
        RouterTestingModule,
        MatButtonModule,
        MatIconModule,
        ...chartImportedModules,
      ],
      providers: [chartProviders],
    }).compileComponents()

    fixture = TestBed.createComponent(ChartOverlayComponent)
    component = fixture.componentInstance
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture)
    service = TestBed.inject(DashboardService)
    httpTestingController = TestBed.inject(HttpTestingController)
    fixture.detectChanges()
  })

  it("should create", () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it("should test filter", async () => {
    fixture.detectChanges()
    await fixture.whenStable()

    const filterButton = await rootLoader.getHarness(
      MatButtonHarness.with({
        selector: "[mat-icon-button]",
      })
    )

    await filterButton?.click()
    fixture.detectChanges()

    const menuLocation = await rootLoader.getHarness(
      MatMenuItemHarness.with({
        text: /location/i,
      })
    )
    await menuLocation.click()
    fixture.detectChanges()

    const searchInput = await rootLoader.getHarness(MatInputHarness)
    await searchInput.setValue("Ka")
    fixture.detectChanges()

    const checkBoxSelectAll = await rootLoader.getHarness(
      MatCheckboxHarness.with({
        label: /select all/i,
      })
    )
    await checkBoxSelectAll.uncheck()
    await checkBoxSelectAll.check()
    fixture.detectChanges()

    const checkBoxLocation = await rootLoader.getHarness(
      MatCheckboxHarness.with({
        label: /ka/i,
      })
    )
    await checkBoxLocation.toggle()
    fixture.detectChanges()

    const inverseMenuButton = await rootLoader.getHarnessOrNull(
      MatMenuItemHarness.with({
        text: /inver/i,
      })
    )
    await inverseMenuButton?.click()
    fixture.detectChanges()

    expect(filterButton).toBeDefined()
  })

  it("should test failed requests", async () => {
    fixture.detectChanges()

    const reqs = httpTestingController.match("chart")

    for (const req of reqs) {
      // Respond with mock error
      console.log(req.request?.url)
      req.flush("failed", { status: 404, statusText: "Not Found" })
    }

    fixture.detectChanges()

    let filterButton = await rootLoader.getHarnessOrNull(
      MatButtonHarness.with({
        selector: "[mat-icon-button]",
      })
    )
    if (!filterButton) {
      filterButton = await rootLoader.getHarness(MatButtonHarness)
    }
    await filterButton?.click()
    fixture.detectChanges()

    service.getFloodChartData(true)
    service.getTrashChartData(true)
    service.getTrafficChartData(true)
    service.getStreetVendorChartData(true)
    service.getCrowdChartData(true)

    expect(filterButton).toBeDefined()
  })
})
