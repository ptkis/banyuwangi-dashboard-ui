import { HttpClientTestingModule } from "@angular/common/http/testing"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { NgxEchartsModule } from "ngx-echarts"

import { ChartComponentComponent } from "./chart-component.component"
import { chartProviders } from "src/app/pages/dashboard/chart-overlay/chart-components"
import { FormsModule } from "@angular/forms"
import { ChartPanelComponent } from "src/app/shared/components/chart-panel/chart-panel.component"
import { materialModules } from "src/app/shared/shared.module"
import { dashboardMaterialModules } from "../../dashboard.module"
import { ListFilterComponent } from "src/app/shared/components/list-filter/list-filter.component"

describe("ChartComponentComponent", () => {
  let component: ChartComponentComponent
  let fixture: ComponentFixture<ChartComponentComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartComponentComponent, ChartPanelComponent],
      imports: [
        materialModules,
        dashboardMaterialModules,
        HttpClientTestingModule,
        NoopAnimationsModule,
        FormsModule,

        ListFilterComponent,
        NgxEchartsModule.forRoot({
          // echarts
          echarts: () => import("echarts"),
        }),
      ],
      providers: [chartProviders],
    }).compileComponents()

    fixture = TestBed.createComponent(ChartComponentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should test chart click", async () => {
    // Mock Image onload

    const echartInstanceMock = {
      on: (type: string, fn: (param?: any) => any) => {
        fn({
          dataIndex: 10,
          seriesName: "x",
          data: 3,
        })
      },
    } as any

    component.onChartInit(echartInstanceMock)
    component.menuClick("x")

    await fixture.whenStable()

    component.rawData = {
      snapshotIds: {
        x: ["1", "1", "1", "1", "1"],
      },
    } as any
    component.onChartInit(echartInstanceMock)
    await fixture.whenStable()
  })
})
