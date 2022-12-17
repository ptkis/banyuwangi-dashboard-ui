import { DialogModule } from "@angular/cdk/dialog"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSidenavModule } from "@angular/material/sidenav"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { ActivatedRoute } from "@angular/router"
import { RouterTestingModule } from "@angular/router/testing"
import { screen, render } from "@testing-library/angular"
import userEvent from "@testing-library/user-event"
import { ChartPanelComponent } from "src/app/shared/components/chart-panel/chart-panel.component"
import { ListFilterComponent } from "src/app/shared/components/list-filter/list-filter.component"
import { getTranslocoModule } from "src/app/transloco-testing.module"
import { chartHttpMockProviders } from "../../dashboard/chart-overlay/mocks/chartMockData"
import { ImageCanvasComponent } from "../image-canvas/image-canvas.component"

import { ChartImageComponent } from "./chart-image.component"

describe("ChartImageComponent", () => {
  const renderComponent = async () => {
    return await render(ChartImageComponent, {
      declarations: [
        ChartImageComponent,
        ImageCanvasComponent,
        ChartPanelComponent,
      ],
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        DialogModule,
        ListFilterComponent,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatSidenavModule,
        MatIconModule,
        getTranslocoModule(),
      ],
      providers: [
        chartHttpMockProviders,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => "trash",
              },
            },
          },
        },
      ],
    })
  }

  it("should create", async () => {
    const observe = jest.fn()
    const unobserve = jest.fn()

    // you can also pass the mock implementation
    // to jest.fn as an argument
    window.IntersectionObserver = jest.fn(() => ({
      observe,
      unobserve,
      root: null,
      rootMargin: "",
      thresholds: [0],
      disconnect: () => {},
      takeRecords: () => {
        return []
      },
    }))
    const user = userEvent.setup()
    const { fixture } = await renderComponent()
    // await fixture.whenStable()
    const dt: any = {
      isIntersecting: true,
    }
    fixture.componentInstance.onIntersection([dt])
    const btnSubmit = screen.getByTestId("btn-form-submit")
    await user.click(btnSubmit)
  })
})
