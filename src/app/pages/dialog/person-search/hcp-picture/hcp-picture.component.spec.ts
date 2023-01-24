import { HttpClientTestingModule } from "@angular/common/http/testing"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { ReusableImageCanvasComponent } from "src/app/shared/components/reusable-image-canvas/reusable-image-canvas.component"

import { HcpPictureComponent } from "./hcp-picture.component"

describe("HcpPictureComponent", () => {
  let component: HcpPictureComponent
  let fixture: ComponentFixture<HcpPictureComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HcpPictureComponent],
      imports: [HttpClientTestingModule, ReusableImageCanvasComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(HcpPictureComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
    component.imageLoaded()
  })
})
