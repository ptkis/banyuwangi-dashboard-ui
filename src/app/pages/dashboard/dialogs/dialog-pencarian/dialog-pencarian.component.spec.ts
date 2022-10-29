import { ComponentFixture, TestBed } from "@angular/core/testing"

import { DialogPencarianComponent } from "./dialog-pencarian.component"

describe("DialogPencarianComponent", () => {
  let component: DialogPencarianComponent
  let fixture: ComponentFixture<DialogPencarianComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogPencarianComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(DialogPencarianComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
