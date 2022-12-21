import { RouterTestingModule } from "@angular/router/testing"
import { render } from "@testing-library/angular"
import { KeycloakAngularModule } from "keycloak-angular"
import { AppComponent } from "./app.component"
import { getTranslocoModule } from "./transloco-testing.module"

describe("AppComponent", () => {
  const renderComponent = async () => {
    return await render(AppComponent, {
      imports: [
        RouterTestingModule,
        getTranslocoModule(),
        KeycloakAngularModule,
      ],
      declarations: [AppComponent],
    })
  }

  it("should create the app", async () => {
    const { fixture } = await renderComponent()
    await fixture.whenStable()
  })
})
