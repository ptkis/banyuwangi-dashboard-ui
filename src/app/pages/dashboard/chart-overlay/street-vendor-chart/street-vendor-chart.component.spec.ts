import { ComponentFixture, TestBed } from "@angular/core/testing"

import { StreetVendorChartComponent } from "./street-vendor-chart.component"

describe("StreetVendorChartComponent", () => {
  let component: StreetVendorChartComponent
  let fixture: ComponentFixture<StreetVendorChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StreetVendorChartComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(StreetVendorChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
