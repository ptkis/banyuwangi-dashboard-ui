import { HttpClientTestingModule } from "@angular/common/http/testing"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatNativeDateModule } from "@angular/material/core"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSelectModule } from "@angular/material/select"
import { MatTableModule } from "@angular/material/table"
import { RouterTestingModule } from "@angular/router/testing"
import { IntersectionObserverModule } from "@ng-web-apis/intersection-observer"
import { render, screen } from "@testing-library/angular"
import userEvent from "@testing-library/user-event"
import { ToastrModule } from "ngx-toastr"
import { throwError } from "rxjs"
import { HCMService } from "src/app/shared/services/hcm.service"
import { SharedModule } from "src/app/shared/shared.module"
import { getTranslocoModule } from "src/app/transloco-testing.module"
import { DialogModule } from "../dialog.module"
import { cctvHttpMockProviders } from "../mocks/cctvlistDataMock"

import { PersonSearchComponent } from "./person-search.component"

jest.mock("@ng-web-apis/intersection-observer")

describe("PersonSearchComponent", () => {
  const renderComponent = async (providers: any[] = []) => {
    return await render(PersonSearchComponent, {
      declarations: [PersonSearchComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        MatButtonModule,
        MatIconModule,
        DialogModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        getTranslocoModule(),
        ToastrModule.forRoot(),
        MatDatepickerModule,
        MatNativeDateModule,
        IntersectionObserverModule,
      ],
      providers: [cctvHttpMockProviders, ...providers],
    })
  }

  it("should create", async () => {
    const observe = jest.fn()
    const unobserve = jest.fn()

    // // you can also pass the mock implementation
    // // to jest.fn as an argument
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
    const { fixture } = await renderComponent()
    const dt: any = {
      isIntersecting: true,
    }
    fixture.detectChanges()
    for (const items of fixture.componentInstance.hcpImages) {
      fixture.componentInstance.onIntersection([dt], items)
    }
    await fixture.whenStable()
  })

  it("should search", async () => {
    const { fixture } = await renderComponent()
    await fixture.whenStable()

    const user = userEvent.setup()
    const btnSearch = screen.getByTestId("btn-search-submit")
    await user.click(btnSearch)
    await fixture.whenStable()
  })
})
