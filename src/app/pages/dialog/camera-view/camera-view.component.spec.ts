import { HttpClientTestingModule } from "@angular/common/http/testing"
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
import { render } from "@testing-library/angular"
import { SharedModule } from "src/app/shared/shared.module"
import { CCTVFormComponent } from "../cctvform/cctvform.component"
import { cctvHttpMockProviders } from "../mocks/cctvlistDataMock"
import { CameraViewComponent } from "./camera-view.component"
import { DialogModule as CDKDialogModule } from "@angular/cdk/dialog"

describe("CameraViewComponent", () => {
  const renderComponent = async () => {
    return await render(CameraViewComponent, {
      declarations: [CCTVFormComponent],
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
      ],
      providers: [cctvHttpMockProviders],
    })
  }

  it("should create", async () => {
    await renderComponent()
  })
})
