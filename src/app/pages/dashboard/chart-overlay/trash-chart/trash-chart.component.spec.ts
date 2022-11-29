import { ComponentFixture, TestBed } from "@angular/core/testing"
import { chartImportedModules, chartProviders } from "../chart-components"

import { TrashChartComponent } from "./trash-chart.component"

describe("TrashChartComponent", () => {
  let component: TrashChartComponent
  let fixture: ComponentFixture<TrashChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrashChartComponent],
      imports: [...chartImportedModules],
      providers: [chartProviders],
    }).compileComponents()

    fixture = TestBed.createComponent(TrashChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
