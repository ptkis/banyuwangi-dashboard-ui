import { DialogModule, DIALOG_DATA } from "@angular/cdk/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { render } from "@testing-library/angular"
import { SharedModule } from "src/app/shared/shared.module"
import { getTranslocoModule } from "src/app/transloco-testing.module"
import { VehicleDetailsComponent } from "./vehicle-details.component"
import * as hcmVehicle from "../../mocks/hcmVehicle.json"

describe("VehicleDetailsComponent", () => {
  const renderComponent = async (providers: any[] = []) => {
    return await render(VehicleDetailsComponent, {
      declarations: [VehicleDetailsComponent],
      imports: [
        SharedModule,
        MatButtonModule,
        MatIconModule,
        DialogModule,
        getTranslocoModule(),
      ],
      providers: [
        {
          provide: DIALOG_DATA,
          useValue: hcmVehicle.data.items[0],
        },
        ...providers,
      ],
    })
  }

  it("should create", async () => {
    const { fixture } = await renderComponent()
    await fixture.whenStable()
  })
})
