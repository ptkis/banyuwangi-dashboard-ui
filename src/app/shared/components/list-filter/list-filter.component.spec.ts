import { ComponentFixture, TestBed } from "@angular/core/testing"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"

import { ListFilterComponent } from "./list-filter.component"

describe("ListFilterComponent", () => {
  let component: ListFilterComponent
  let fixture: ComponentFixture<ListFilterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListFilterComponent, NoopAnimationsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(ListFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})