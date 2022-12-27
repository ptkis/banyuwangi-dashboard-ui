import { Component } from "@angular/core"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { RouterTestingModule } from "@angular/router/testing"
import { dashboardComponents } from "../.."
import { chartImportedModules, chartProviders } from "../chart-components"
import { LineChartComponent } from "./line-chart.component"

@Component({
  selector: "app-dummy-cmp",
  styles: [""],
  template: ` Hello `,
})
class DummyComponent {}

describe("LineChartComponent", () => {
  let component: LineChartComponent
  let fixture: ComponentFixture<LineChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [...dashboardComponents, DummyComponent],
      imports: [
        ...chartImportedModules,
        RouterTestingModule.withRoutes([
          {
            path: "toast-chart-image",
            component: DummyComponent,
            outlet: "dialog",
          },
          {
            path: "chart-data",
            component: DummyComponent,
            outlet: "dialog",
          },
        ]),
      ],
      providers: [chartProviders],
    }).compileComponents()

    fixture = TestBed.createComponent(LineChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should test point click", () => {
    component.pointClick({
      dataIndex: 0,
      seriesName: "x",
      data: 2,
    })

    component.menuClick("image")
    component.menuClick("data")
    component.menuClick("download")

    component.echartLoaded({} as any)
  })
})
