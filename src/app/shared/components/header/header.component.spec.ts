import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from "@angular/core/testing"

import { HeaderComponent } from "./header.component"
import { take } from "rxjs"
import { materialModules } from "../../shared.module"

describe("HeaderComponent", () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [...materialModules],
    }).compileComponents()

    fixture = TestBed.createComponent(HeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should show date", fakeAsync(() => {
    let num: Date | undefined
    component.time$.pipe(take(1)).subscribe((val) => (num = val))
    tick(3000)
    fixture.detectChanges()
    expect(num).toBeDefined()
    flush()
  }))
})
