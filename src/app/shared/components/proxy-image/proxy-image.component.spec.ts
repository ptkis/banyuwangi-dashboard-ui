import { HttpClientTestingModule } from "@angular/common/http/testing"
import { ComponentFixture, TestBed } from "@angular/core/testing"

import { ProxyImageComponent } from "./proxy-image.component"

describe("ProxyImageComponent", () => {
  let component: ProxyImageComponent
  let fixture: ComponentFixture<ProxyImageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProxyImageComponent, HttpClientTestingModule],
    }).compileComponents()

    fixture = TestBed.createComponent(ProxyImageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
