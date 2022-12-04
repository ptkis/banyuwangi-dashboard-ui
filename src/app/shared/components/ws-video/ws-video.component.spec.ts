import { HttpClientTestingModule } from "@angular/common/http/testing"
import { render, waitFor } from "@testing-library/angular"

import { WsVideoComponent } from "./ws-video.component"

describe("WsVideoComponent", () => {
  const renderComponent = async () => {
    return await render(WsVideoComponent, {
      declarations: [WsVideoComponent],
      imports: [HttpClientTestingModule],
    })
  }

  it("should create", async () => {
    await renderComponent()
  })

  it("should play", async () => {
    const res = await renderComponent()
    const component = res.fixture.componentInstance
    component.realplay("ws://192.168.256.3/SMSEurl/AbcDEF/fdfd/sdf")
    component.realplay("ws://failed/SMSEurl/AbcDEF/fdfd/sdf")
    waitFor(() => expect(component.errorMessage).toBeTruthy(), {
      timeout: 100,
    })
  })

  it("should not play with empty message", async () => {
    const res = await renderComponent()
    const component = res.fixture.componentInstance
    jest.spyOn(component.jsDecoder, "JS_Play").mockImplementationOnce(() => {
      return new Promise((_resolve, reject) => reject(null))
    })
    component.realplay("ws://failed/SMSEurl/AbcDEF/fdfd/sdf")
    waitFor(() => expect(component.errorMessage).toBeTruthy(), {
      timeout: 100,
    })
  })

  it("should not play", async () => {
    const res = await renderComponent()
    const component = res.fixture.componentInstance
    component.realplay("")
    component.realplay("boom")
  })
})
