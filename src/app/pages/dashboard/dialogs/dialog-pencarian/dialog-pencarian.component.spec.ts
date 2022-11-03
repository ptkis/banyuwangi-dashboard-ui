import { ComponentFixture, TestBed } from "@angular/core/testing"
import { SharedModule } from "src/app/shared/shared.module"
import { dashboardDialogs } from ".."

import { DialogPencarianComponent } from "./dialog-pencarian.component"

describe("DialogPencarianComponent", () => {
  let component: DialogPencarianComponent
  let fixture: ComponentFixture<DialogPencarianComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [dashboardDialogs],
      imports: [SharedModule],
    }).compileComponents()

    fixture = TestBed.createComponent(DialogPencarianComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
