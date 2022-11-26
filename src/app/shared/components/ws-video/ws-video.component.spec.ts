import { HttpClientTestingModule } from "@angular/common/http/testing"
import { ComponentFixture, TestBed } from "@angular/core/testing"

import { WsVideoComponent } from "./ws-video.component"

class JSPlugin {
  constructor(obj: object) {}

  JS_Play(url: string, data: object, window: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("foo")
      }, 300)
    })
  }

  JS_Stop(foo: any) {
    return true
  }
}

;(window as any)["JSPlugin"] = JSPlugin

describe("WsVideoComponent", () => {
  let component: WsVideoComponent
  let fixture: ComponentFixture<WsVideoComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WsVideoComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents()

    fixture = TestBed.createComponent(WsVideoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
