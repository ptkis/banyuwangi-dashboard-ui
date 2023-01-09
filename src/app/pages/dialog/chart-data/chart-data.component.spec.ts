import { DialogModule } from "@angular/cdk/dialog"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatNativeDateModule } from "@angular/material/core"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatSelectModule } from "@angular/material/select"
import { MatSortModule } from "@angular/material/sort"
import { MatTableModule } from "@angular/material/table"
import { ActivatedRoute } from "@angular/router"
import { RouterTestingModule } from "@angular/router/testing"
import { render } from "@testing-library/angular"
import { screen } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import { ToastrModule } from "ngx-toastr"
import { of } from "rxjs"
import { SharedModule } from "src/app/shared/shared.module"
import { getTranslocoModule } from "src/app/transloco-testing.module"
import { chartHttpMockProviders } from "../../dashboard/chart-overlay/mocks/chartMockData"
import { cctvHttpMockProviders } from "../mocks/cctvlistDataMock"

import { ChartDataComponent } from "./chart-data.component"

describe("ChartDataComponent", () => {
  const renderComponent = async (providers: any[] = []) => {
    return await render(ChartDataComponent, {
      declarations: [ChartDataComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        MatButtonModule,
        MatIconModule,
        DialogModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        getTranslocoModule(),
        ToastrModule.forRoot(),
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      providers: [chartHttpMockProviders, ...providers],
    })
  }

  it("should create", async () => {
    const { fixture } = await renderComponent()
    await fixture.whenStable()
  })

  it("should read query params", async () => {
    const { fixture } = await renderComponent([
      {
        provide: ActivatedRoute,
        useValue: {
          queryParamMap: of({
            get: (key: string) => {
              const data = {
                startDate: "2022-12-22",
                endDate: "2022-12-22",
                camera: "x",
                type: "flood",
              } as any
              return data[key]
            },
          }),
        },
      },
    ])
    await fixture.whenStable()

    const btnSearch = screen.getByTestId("btn-search-submit")
    const user = userEvent.setup()

    await user.click(btnSearch)

    const btnExport = screen.getByTestId("btn-export")

    await user.click(btnExport)

    await fixture.whenStable()
  })

  it("should read query params with empty type", async () => {
    const { fixture } = await renderComponent([
      {
        provide: ActivatedRoute,
        useValue: {
          queryParamMap: of({
            get: (key: string) => {
              const data = {
                startDate: "2022-12-22",
                endDate: "2022-12-22",
                camera: "x",
              } as any
              return data[key]
            },
          }),
        },
      },
    ])
    await fixture.whenStable()

    const btnSearch = screen.getByTestId("btn-search-submit")
    const user = userEvent.setup()

    await user.click(btnSearch)

    const btnExport = screen.getByTestId("btn-export")

    await user.click(btnExport)

    await fixture.whenStable()
  })
})
