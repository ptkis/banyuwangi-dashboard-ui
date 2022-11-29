import { ComponentFixture, TestBed } from "@angular/core/testing"
import { chartImportedModules, chartProviders } from "../chart-components"

import { CrowdChartComponent } from "./crowd-chart.component"

describe("CrowdChartComponent", () => {
  let component: CrowdChartComponent
  let fixture: ComponentFixture<CrowdChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrowdChartComponent],
      imports: [...chartImportedModules],
      providers: [chartProviders],
    }).compileComponents()

    fixture = TestBed.createComponent(CrowdChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
