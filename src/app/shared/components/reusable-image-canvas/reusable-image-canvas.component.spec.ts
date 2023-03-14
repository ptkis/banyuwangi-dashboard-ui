import { ComponentFixture, TestBed } from "@angular/core/testing"

import { ReusableImageCanvasComponent } from "./reusable-image-canvas.component"

describe("ReusableImageCanvasComponent", () => {
  let component: ReusableImageCanvasComponent
  let fixture: ComponentFixture<ReusableImageCanvasComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableImageCanvasComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ReusableImageCanvasComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
