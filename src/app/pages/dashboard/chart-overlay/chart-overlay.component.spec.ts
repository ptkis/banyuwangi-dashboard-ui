import { TestBed } from "@angular/core/testing"

import { ChartOverlayComponent } from "./chart-overlay.component"

import { RouterTestingModule } from "@angular/router/testing"
import { chartImportedModules, chartProviders } from "./chart-components"
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed"
import { MatButtonHarness } from "@angular/material/button/testing"
import { MatCheckboxHarness } from "@angular/material/checkbox/testing"
import { MatInputHarness } from "@angular/material/input/testing"
import { MatMenuItemHarness } from "@angular/material/menu/testing"
import { DashboardService } from "../dashboard.service"

import { render, screen } from "@testing-library/angular"
import { dashboardComponents } from ".."
import { dashboardMaterialModules } from "../dashboard.module"

jest.setTimeout(15000)

describe("ChartOverlayComponent", () => {
  const renderComponent = async () => {
    return await render(ChartOverlayComponent, {
      declarations: [dashboardComponents],
      imports: [
        RouterTestingModule,
        ...dashboardMaterialModules,
        ...chartImportedModules,
      ],
      providers: [chartProviders],
    })
  }

  it("should test filter", async () => {
    const res = await renderComponent()
    const fixture = res.fixture
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture)

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

  it("should test mock echart", async () => {
    const res = await renderComponent()
    const fixture = res.fixture
    await fixture.whenStable()
    const mock = {
      on: (e: string, cb: any) => {
        cb()
      },
    }
    fixture.componentInstance.trashChart.echartLoaded(mock as any)
  })

  it("should test failed requests", async () => {
    const res = await renderComponent()
    const fixture = res.fixture
    fixture.detectChanges()

    const service = TestBed.inject(DashboardService)

    service.getFloodChartData(true)
    service.getTrashChartData(true)
    service.getTrafficChartData(true)
    service.getStreetVendorChartData(true)
    service.getCrowdChartData(true)

    expect(service).toBeDefined()
  })
})
