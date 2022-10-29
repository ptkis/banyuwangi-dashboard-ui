import { ComponentFixture, TestBed } from "@angular/core/testing"

import { DialogPencarianKendaraanComponent } from "./dialog-pencarian-kendaraan.component"

describe("DialogPencarianKendaraanComponent", () => {
  let component: DialogPencarianKendaraanComponent
  let fixture: ComponentFixture<DialogPencarianKendaraanComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogPencarianKendaraanComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(DialogPencarianKendaraanComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
