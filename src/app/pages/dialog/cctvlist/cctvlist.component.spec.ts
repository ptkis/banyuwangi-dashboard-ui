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
import { TranslocoRootModule } from "src/app/transloco-root.module"
import { getTranslocoModule } from "src/app/transloco-testing.module"

jest.setTimeout(15000)

describe("CCTVListComponent", () => {
  const renderComponent = async () => {
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
      ],
      providers: [cctvHttpMockProviders],
    })
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
    const btnSubmit = screen.getByTestId("btn-form-submit")
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
    const btnSubmit = screen.getByTestId("btn-form-submit")
    await user.click(btnSubmit)
    fixture.componentRef.instance.modalService.showConfirm("test")
  })

  it("should test delete button", async () => {
    const user = userEvent.setup()
    const { fixture } = await renderComponent()
    await fixture.whenStable()
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
    await user.click(btnConfirm)
    await fixture.whenStable()
    await waitFor(
      () => {
        debug()
        expect(document.querySelector("app-modal")).not.toBeInTheDocument()
      },
      {
        timeout: 2000,
      }
    )
  })
})
