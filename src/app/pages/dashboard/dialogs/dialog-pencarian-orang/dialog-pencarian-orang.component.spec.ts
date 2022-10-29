import { ComponentFixture, TestBed } from "@angular/core/testing"

import { DialogPencarianOrangComponent } from "./dialog-pencarian-orang.component"

describe("DialogPencarianOrangComponent", () => {
  let component: DialogPencarianOrangComponent
  let fixture: ComponentFixture<DialogPencarianOrangComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogPencarianOrangComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(DialogPencarianOrangComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
