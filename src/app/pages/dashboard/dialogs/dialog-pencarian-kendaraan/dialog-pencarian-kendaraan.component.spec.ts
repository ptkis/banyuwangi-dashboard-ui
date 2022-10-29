import { ComponentFixture, TestBed } from "@angular/core/testing"
import { SharedModule } from "src/app/shared/shared.module"
import { dashboardDialogs } from ".."

import { DialogPencarianKendaraanComponent } from "./dialog-pencarian-kendaraan.component"

describe("DialogPencarianKendaraanComponent", () => {
  let component: DialogPencarianKendaraanComponent
  let fixture: ComponentFixture<DialogPencarianKendaraanComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [dashboardDialogs],
      imports: [SharedModule],
    }).compileComponents()

    fixture = TestBed.createComponent(DialogPencarianKendaraanComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
