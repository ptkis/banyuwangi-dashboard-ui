import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HttpClientTestingModule } from "@angular/common/http/testing"

import { HikVideoComponent } from "./hik-video.component"

import { VgCoreModule } from "@videogular/ngx-videogular/core"
import { VgControlsModule } from "@videogular/ngx-videogular/controls"
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play"
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering"
import { VgStreamingModule } from "@videogular/ngx-videogular/streaming"
import { render } from "@testing-library/angular"
import { HCMService } from "../../services/hcm.service"
import { of } from "rxjs"

describe("HikVideoComponent", () => {
  const renderComponent = async (
    props: Partial<HikVideoComponent>,
    providers: any[] = []
  ) => {
    return await render(HikVideoComponent, {
      declarations: [HikVideoComponent],
      imports: [
        HttpClientTestingModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        VgStreamingModule,
      ],
      providers: [...providers],
      componentProperties: props,
    })
  }

  it("should play url", async () => {
    const { fixture } = await renderComponent({
      url: "xxx",
    })
    await fixture.whenStable()
  })

  it("should get URL from API", async () => {
    class mockService {
      getStreamingURL = jest.fn().mockReturnValue(
        of({
          code: "0",
          msg: "ok",
          data: {
            url: "localhost",
          },
        })
      )
    }
    const { fixture } = await renderComponent(
      {
        cctv_id: "xxx",
      },
      [
        {
          provide: HCMService,
          useClass: mockService,
        },
      ]
    )
    await fixture.whenStable()
  })
})
