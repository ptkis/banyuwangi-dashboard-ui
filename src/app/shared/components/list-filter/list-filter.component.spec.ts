import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormsModule } from "@angular/forms"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { materialModules } from "../../shared.module"

import { ListFilterComponent } from "./list-filter.component"

describe("ListFilterComponent", () => {
  let component: ListFilterComponent
  let fixture: ComponentFixture<ListFilterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListFilterComponent],
      imports: [materialModules, FormsModule, NoopAnimationsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(ListFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
