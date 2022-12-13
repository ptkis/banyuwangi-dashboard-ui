import { CommonModule } from "@angular/common"
import { RouterTestingModule } from "@angular/router/testing"
import { render } from "@testing-library/angular"
import { SharedModule } from "src/app/shared/shared.module"
import { HeaderLayoutComponent } from "./header-layout.component"

describe("HeaderLayoutComponent", () => {
  const renderComponent = async () => {
    return await render(HeaderLayoutComponent, {
      declarations: [HeaderLayoutComponent],
      imports: [CommonModule, RouterTestingModule, SharedModule],
    })
  }

  it("should create", async () => {
    await renderComponent()
  })
})
