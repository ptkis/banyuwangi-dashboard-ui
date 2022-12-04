import { ComponentFixture, TestBed } from "@angular/core/testing"
import { render } from "@testing-library/angular"
import { throwError } from "rxjs"
import { chartImportedModules, chartProviders } from "../chart-components"

import { CrowdChartComponent } from "./crowd-chart.component"

import { DashboardService } from "../../dashboard.service"

describe("CrowdChartComponent", () => {
  const renderComponent = async (providers: any[] = []) => {
    return await render(CrowdChartComponent, {
      declarations: [CrowdChartComponent],
      imports: [...chartImportedModules],
      providers: [
        // chartProviders,
        ...providers,
      ],
    })
  }

  it("should create", async () => {
    await renderComponent()
  })

  it("should test error response", async () => {
    class mockService {
      getCrowdChartData() {
        return throwError(() => ({ statusText: "Error" }))
      }
    }
    const res = await renderComponent([
      {
        provide: DashboardService,
        useClass: mockService,
      },
    ])
    const fixture = res.fixture
    fixture.detectChanges()
    await fixture.whenStable()
  })
})
