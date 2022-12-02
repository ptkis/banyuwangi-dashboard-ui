import { ComponentFixture, TestBed } from "@angular/core/testing"
import { chartImportedModules, chartProviders } from "../chart-components"

import { TrafficChartComponent } from "./traffic-chart.component"

describe("TrafficChartComponent", () => {
  let component: TrafficChartComponent
  let fixture: ComponentFixture<TrafficChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrafficChartComponent],
      imports: [...chartImportedModules],
      providers: [chartProviders],
    }).compileComponents()

    fixture = TestBed.createComponent(TrafficChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
