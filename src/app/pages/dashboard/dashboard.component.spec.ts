import { ComponentFixture, TestBed } from "@angular/core/testing"
import { NgxEchartsModule } from "ngx-echarts"

import { DashboardComponent } from "./dashboard.component"
import { SharedModule } from "../../shared/shared.module"

describe("DashboardComponent", () => {
  let component: DashboardComponent
  let fixture: ComponentFixture<DashboardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        SharedModule,
        NgxEchartsModule.forRoot({
          // echarts
          echarts: () => import("echarts"),
        }),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DashboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
