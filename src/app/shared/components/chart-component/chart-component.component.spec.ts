import { HttpClientTestingModule } from "@angular/common/http/testing"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { NgxEchartsModule } from "ngx-echarts"
import { materialModules } from "../../shared.module"
import { ChartPanelComponent } from "../chart-panel/chart-panel.component"

import { ChartComponentComponent } from "./chart-component.component"
import { DashboardService } from "src/app/pages/dashboard/dashboard.service"
import { chartProviders } from "src/app/pages/dashboard/chart-overlay/chart-components"
import { ListFilterComponent } from "../list-filter/list-filter.component"
import { FormsModule } from "@angular/forms"

describe("ChartComponentComponent", () => {
  let component: ChartComponentComponent
  let fixture: ComponentFixture<ChartComponentComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ChartComponentComponent,
        ChartPanelComponent,
        ListFilterComponent,
      ],
      imports: [
        materialModules,
        HttpClientTestingModule,
        NoopAnimationsModule,
        FormsModule,

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
})
