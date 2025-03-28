import { ComponentFixture, TestBed } from "@angular/core/testing"

import { StatistikComponent } from "./statistik.component"

describe("StatistikComponent", () => {
  let component: StatistikComponent
  let fixture: ComponentFixture<StatistikComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatistikComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(StatistikComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
