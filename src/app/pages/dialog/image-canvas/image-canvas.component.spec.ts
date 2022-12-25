import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormsModule } from "@angular/forms"
import { MatCheckboxModule } from "@angular/material/checkbox"

import { ImageCanvasComponent } from "./image-canvas.component"

describe("ImageCanvasComponent", () => {
  let component: ImageCanvasComponent
  let fixture: ComponentFixture<ImageCanvasComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageCanvasComponent],
      imports: [MatCheckboxModule, FormsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(ImageCanvasComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
