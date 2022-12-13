import { DialogModule } from "@angular/cdk/dialog"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { ChartPanelComponent } from "../chart-panel/chart-panel.component"

import { ModalComponent } from "./modal.component"

describe("ModalComponent", () => {
  let component: ModalComponent
  let fixture: ComponentFixture<ModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent, ChartPanelComponent],
      imports: [DialogModule],
    }).compileComponents()

    fixture = TestBed.createComponent(ModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
