import { ComponentFixture, TestBed } from "@angular/core/testing"

import { ChartImageComponent } from "./chart-image.component"

describe("ChartImageComponent", () => {
  let component: ChartImageComponent
  let fixture: ComponentFixture<ChartImageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartImageComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ChartImageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
