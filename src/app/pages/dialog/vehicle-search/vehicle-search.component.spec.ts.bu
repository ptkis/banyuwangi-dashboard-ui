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
import { MatTableModule } from "@angular/material/table"
import { RouterTestingModule } from "@angular/router/testing"
import { render } from "@testing-library/angular"
import { screen } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import { ToastrModule } from "ngx-toastr"
import { of, throwError } from "rxjs"
import { ProxyImageComponent } from "src/app/shared/components/proxy-image/proxy-image.component"
import { HCMService } from "src/app/shared/services/hcm.service"
import { SharedModule } from "src/app/shared/shared.module"
import { getTranslocoModule } from "src/app/transloco-testing.module"
import { DialogModule } from "../dialog.module"
import { cctvHttpMockProviders } from "../mocks/cctvlistDataMock"
import { VehicleSearchComponent } from "./vehicle-search.component"

describe("VehicleSearchComponent", () => {
  const renderComponent = async (providers: any[] = []) => {
    return await render(VehicleSearchComponent, {
      declarations: [VehicleSearchComponent],
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
        FormsModule,
        ReactiveFormsModule,
        getTranslocoModule(),
        ToastrModule.forRoot(),
        MatDatepickerModule,
        MatNativeDateModule,
        ProxyImageComponent,
      ],
      providers: [cctvHttpMockProviders, ...providers],
    })
  }

  it("should create", async () => {
    const { fixture } = await renderComponent()
    await fixture.whenStable()
  })

  it("should search", async () => {
    const { fixture } = await renderComponent()
    await fixture.whenStable()

    const user = userEvent.setup()
    const platenoinput = screen.getByTestId(/platenoinput/i)
    await user.type(platenoinput, "123")
    const btnSearch = screen.getByTestId("btn-search-submit")
    await user.click(btnSearch)
    await fixture.whenStable()

    const btnView = screen.getAllByTestId("btn-view")[0]
    await user.click(btnView)
    await fixture.whenStable()

    fixture.componentInstance.handlePageEvent({
      pageIndex: 1,
      pageSize: 10,
    } as any)
  })

  it("should test error response", async () => {
    class mockService {
      getVehicleData() {
        return throwError(() => ({ statusText: "Error" }))
      }
    }
    const res = await renderComponent([
      {
        provide: HCMService,
        useClass: mockService,
      },
    ])
    const fixture = res.fixture
    fixture.detectChanges()
    await fixture.whenStable()
  })

  it("should test image proxy", async () => {
    class mockService extends HCMService {
      override getImageFromProxy(uri: string) {
        const file = new File(["(⌐□_□)"], "chucknorris.png", {
          type: "image/jpg",
        })
        return of(file)
      }
    }
    const res = await renderComponent([
      {
        provide: HCMService,
        useClass: mockService,
      },
    ])
    const fixture = res.fixture
    fixture.detectChanges()
    await fixture.whenStable()
  })
})
