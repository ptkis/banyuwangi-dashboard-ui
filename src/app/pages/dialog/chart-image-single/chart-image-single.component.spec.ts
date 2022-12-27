import { DialogModule } from "@angular/cdk/dialog"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatIconModule } from "@angular/material/icon"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { ActivatedRoute } from "@angular/router"
import { RouterTestingModule } from "@angular/router/testing"
import { render, screen } from "@testing-library/angular"
import userEvent from "@testing-library/user-event"
import { of } from "rxjs"
import { ChartPanelComponent } from "src/app/shared/components/chart-panel/chart-panel.component"
import { getTranslocoModule } from "src/app/transloco-testing.module"
import { chartHttpMockProviders } from "../../dashboard/chart-overlay/mocks/chartMockData"
import { ImageCanvasComponent } from "../image-canvas/image-canvas.component"

import { ChartImageSingleComponent } from "./chart-image-single.component"

describe("ChartImageSingleComponent", () => {
  const renderComponent = async (providers: unknown[] = []) => {
    return await render(ChartImageSingleComponent, {
      declarations: [
        ChartImageSingleComponent,
        ChartPanelComponent,
        ImageCanvasComponent,
      ],
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        DialogModule,
        // ListFilterComponent,
        MatButtonModule,
        // MatProgressSpinnerModule,
        // MatSidenavModule,
        MatIconModule,
        MatCheckboxModule,
        FormsModule,
        getTranslocoModule(),
      ],
      providers: [chartHttpMockProviders, ...providers],
    })
  }

  it("should create", async () => {
    // Mock Image onload
    Object.defineProperty(Image.prototype, "onload", {
      get: function () {
        return this._onload
      },
      set: function (fn) {
        this._onload = fn

        setTimeout(() => {
          fn()
        })
      },
    })

    const { fixture } = await renderComponent([
      {
        provide: ActivatedRoute,
        useValue: {
          queryParamMap: of({
            get: (key: string) => {
              if (key === "data") {
                return '{"maxValue":5,"snapshotCount":{"snapshot":{"imageId":"87756603-2da4-43cf-adc8-c9abb279e72e","camera":{"vmsCameraIndexCode":"471","vmsType":"HCP","name":"LORONG_KANTIN_GWD","location":"","latitude":0.0,"longitude":0.0,"host":"10.101.6.241","httpPort":80,"rtspPort":554,"channel":1,"captureQualityChannel":"01","userName":"admin","password":"Admin123","isActive":true,"isStreetvendor":false,"isTraffic":false,"isCrowd":false,"isTrash":false,"isFlood":false,"type":"HIKVISION","label":"","alarmSetting":{"maxFlood":null,"maxTrash":null,"maxStreetvendor":null,"maxCrowd":5,"maxTraffic":5},"id":"394182ed-305b-4237-b23c-7751815b8dfa"},"length":70118,"isAnnotation":false,"id":"c8a3a47f-bf05-44f8-8a04-4affc8cd9daf"},"snapshotCreated":"2022-12-24T06:16:22.424359Z","snapshotImageId":"87756603-2da4-43cf-adc8-c9abb279e72e","snapshotCameraName":"LORONG_KANTIN_GWD","snapshotCameraLocation":"","type":"TRAFFIC","value":6,"id":"eeffed9b-9e8b-431a-8b88-5768c2c91937"},"id":"837cc271-d4a3-4347-9d04-52945bce5a99"}'
              }
              return "img"
            },
          }),
        },
      },
    ])
    await fixture.whenStable()
  })

  it("should load image with snapshot id", async () => {
    const { fixture } = await renderComponent([
      {
        provide: ActivatedRoute,
        useValue: {
          queryParamMap: of({
            get: (key: string) => {
              const data = {
                snapshotid: "x",
                value: 10,
                type: "flood",
              } as any
              return data[key]
            },
          }),
        },
      },
    ])
    await fixture.whenStable()

    const btnDownload = screen.getByTestId("btn-download")
    const user = userEvent.setup()
    await user.click(btnDownload)

    await fixture.whenStable()
  })
})
