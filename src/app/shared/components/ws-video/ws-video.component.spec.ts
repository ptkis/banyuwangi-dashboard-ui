import { ComponentFixture, TestBed } from "@angular/core/testing"

import { WsVideoComponent } from "./ws-video.component"

describe("WsVideoComponent", () => {
  let component: WsVideoComponent
  let fixture: ComponentFixture<WsVideoComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WsVideoComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(WsVideoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
