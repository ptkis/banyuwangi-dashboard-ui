import { ComponentFixture, TestBed } from "@angular/core/testing"

import { FloodChartComponent } from "./flood-chart.component"

describe("FloodChartComponent", () => {
  let component: FloodChartComponent
  let fixture: ComponentFixture<FloodChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FloodChartComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(FloodChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
