import { ComponentFixture, TestBed } from "@angular/core/testing"
import { dashboardComponents } from "../.."
import { chartImportedModules, chartProviders } from "../chart-components"

import { FloodChartComponent } from "./flood-chart.component"

describe("FloodChartComponent", () => {
  let component: FloodChartComponent
  let fixture: ComponentFixture<FloodChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [...dashboardComponents],
      imports: [...chartImportedModules],
      providers: [chartProviders],
    }).compileComponents()

    fixture = TestBed.createComponent(FloodChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
