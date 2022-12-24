import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatSelectModule } from "@angular/material/select"
import { MatTableModule } from "@angular/material/table"
import { RouterTestingModule } from "@angular/router/testing"
import { render, screen, waitFor } from "@testing-library/angular"
import userEvent from "@testing-library/user-event"
import { SharedModule } from "src/app/shared/shared.module"
import { CCTVFormComponent } from "../cctvform/cctvform.component"

import { CCTVListComponent } from "./cctvlist.component"
import { DialogModule as CDKDialogModule } from "@angular/cdk/dialog"
import { cctvHttpMockProviders } from "../mocks/cctvlistDataMock"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { debug } from "jest-preview"
import { getTranslocoModule } from "src/app/transloco-testing.module"
import { throwError } from "rxjs"
import { CCTVListService } from "./cctvlist.service"
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup"
import { ComponentFixture } from "@angular/core/testing"
import { ToastrModule } from "ngx-toastr"

jest.setTimeout(15000)

describe("CCTVListComponent", () => {
  const renderComponent = async (providers: any[] = []) => {
    return await render(CCTVListComponent, {
      declarations: [CCTVListComponent, CCTVFormComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        MatButtonModule,
        MatIconModule,
        CDKDialogModule,
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
      ],
      providers: [cctvHttpMockProviders, ...providers],
    })
  }

  const openAddModal = async (
    user: UserEvent,
    fixture: ComponentFixture<CCTVListComponent>
  ) => {
    const btnAdd = screen.getByTestId("btn-add")
    await user.click(btnAdd)
    await fixture.whenStable()
    await waitFor(
      () => {
        expect(document.querySelector("app-cctvform")).toBeInTheDocument()
      },
      {
        timeout: 2000,
      }
    )
    const btnCancel = screen.getByTestId("btn-form-cancel")
    const btnSubmit = screen.getByTestId("btn-form-submit")
    return {
      btnSubmit,
      btnCancel,
    }
  }

  const openEditModal = async (
    user: UserEvent,
    fixture: ComponentFixture<CCTVListComponent>
  ) => {
    const btnEdit = screen.getAllByTestId("btn-edit")[0]
    await user.click(btnEdit)
    await fixture.whenStable()
    await waitFor(
      () => {
        expect(document.querySelector("app-cctvform")).toBeInTheDocument()
      },
      {
        timeout: 2000,
      }
    )
    const btnCancel = screen.getByTestId("btn-form-cancel")
    const btnSubmit = screen.getByTestId("btn-form-submit")
    return {
      btnSubmit,
      btnCancel,
    }
  }

  const performDelete = async (
    user: UserEvent,
    fixture: ComponentFixture<CCTVListComponent>
  ) => {
    const btnDelete = screen.getAllByTestId("btn-delete")[0]
    await user.click(btnDelete)
    await fixture.whenStable()
    await waitFor(
      () => {
        expect(document.querySelector("app-modal")).toBeInTheDocument()
      },
      {
        timeout: 2000,
      }
    )
    const btnCancel = screen.getByTestId("btn-modal-cancel")
    await user.click(btnCancel)

    await user.click(btnDelete)
    await fixture.whenStable()
    await waitFor(
      () => {
        expect(document.querySelector("app-modal")).toBeInTheDocument()
      },
      {
        timeout: 2000,
      }
    )
    const btnConfirm = screen.getByTestId("btn-modal-confirm")
    debug()
    await user.click(btnConfirm)
    await fixture.whenStable()
    await waitFor(
      () => {
        expect(document.querySelector("app-modal")).not.toBeInTheDocument()
      },
      {
        timeout: 2000,
      }
    )
  }

  it("should create", async () => {
    const { fixture } = await renderComponent()
    await fixture.whenStable()
  })

  it("should close", async () => {
    const user = userEvent.setup()
    const { fixture } = await renderComponent()
    await fixture.whenStable()
    const btnClose = screen.getByTestId("btn-close")
    await user.click(btnClose)
    expect(btnClose).not.toBeInTheDocument()
  })

  it("should test add dialog", async () => {
    const user = userEvent.setup()
    const { fixture } = await renderComponent()
    await fixture.whenStable()
    const { btnSubmit } = await openAddModal(user, fixture)
    await user.click(btnSubmit)
    const vmsCameraIndexcode = screen.getByTestId(/vmsCameraIndexcode/i)
    await user.type(vmsCameraIndexcode, "123")
    const name = screen.getByTestId(/^name$/i)
    await user.type(name, "test")
    await user.click(btnSubmit)
    await fixture.whenStable()
  })

  it("should test import HCP button", async () => {
    const user = userEvent.setup()
    const { fixture } = await renderComponent()
    await fixture.whenStable()
    const btnImport = screen.getAllByTestId("btn-import")[0]
    await user.click(btnImport)
    await fixture.whenStable()
  })

  it("should test view button", async () => {
    const user = userEvent.setup()
    const { fixture, container } = await renderComponent()
    await fixture.whenStable()
    const btnView = screen.getAllByTestId("btn-view")[0]
    await user.click(btnView)
    await fixture.whenStable()
    await waitFor(
      () => {
        expect(document.querySelector("app-cctvform")).toBeInTheDocument()
      },
      {
        timeout: 2000,
      }
    )
  })

  it("should test edit dialog", async () => {
    const user = userEvent.setup()
    const { fixture } = await renderComponent()
    await fixture.whenStable()
    const { btnSubmit } = await openEditModal(user, fixture)
    await user.click(btnSubmit)
    fixture.componentRef.instance.modalService.showConfirm("test")
    fixture.componentRef.instance.modalService.showNotificationToast(
      {
        data: {},
        message: "test",
      },
      {}
    )
    const toast = screen.getByTestId("toast-container")
    await user.click(toast)
  })

  it("should test delete button", async () => {
    const user = userEvent.setup()
    const { fixture } = await renderComponent()
    await fixture.whenStable()
    await performDelete(user, fixture)
  })

  it("should show error", async () => {
    jest.mock("./cctvlist.service")
    const user = userEvent.setup()
    const errMessage = "test error message"
    const errResp = throwError(() => {
      return {
        error: {
          message: errMessage,
        },
      }
    })
    CCTVListService.prototype.postCCTVData = () => errResp
    CCTVListService.prototype.postCCTVDataBulk = () => errResp
    CCTVListService.prototype.deleteCCTVData = () => errResp

    const { fixture } = await renderComponent()

    await fixture.whenStable()

    // Edit should show error message
    const { btnSubmit, btnCancel } = await openEditModal(user, fixture)
    await user.click(btnSubmit)

    await fixture.whenStable()
    const errToast = screen.getByText(errMessage)
    expect(errToast).toBeInTheDocument()
    await user.click(errToast)
    await user.click(btnCancel)

    // Add should show error message
    const { btnSubmit: btnSubmitAdd, btnCancel: btnCancelAdd } =
      await openAddModal(user, fixture)
    const vmsCameraIndexcode = screen.getByTestId(/vmsCameraIndexcode/i)
    await user.type(vmsCameraIndexcode, "123")
    const name = screen.getByTestId(/^name$/i)
    await user.type(name, "test")
    await user.click(btnSubmitAdd)
    await fixture.whenStable()
    const errToastAdd = screen.getByText(errMessage)
    expect(errToastAdd).toBeInTheDocument()
    await user.click(errToastAdd)
    await user.click(btnCancelAdd)

    // Delete should show error message
    await performDelete(user, fixture)
    await fixture.whenStable()
    const errToastdelete = screen.getByText(errMessage)
    expect(errToastdelete).toBeInTheDocument()
    await user.click(errToastdelete)
  })
})
