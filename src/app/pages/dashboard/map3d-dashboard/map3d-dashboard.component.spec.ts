import { ComponentFixture, TestBed } from "@angular/core/testing"

import { Map3dDashboardComponent } from "./map3d-dashboard.component"

describe("Map3dDashboardComponent", () => {
  let component: Map3dDashboardComponent
  let fixture: ComponentFixture<Map3dDashboardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Map3dDashboardComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(Map3dDashboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
