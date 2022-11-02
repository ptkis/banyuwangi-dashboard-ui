import { CommonModule } from "@angular/common"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { RouterTestingModule } from "@angular/router/testing"
import { SharedModule } from "src/app/shared/shared.module"

import { LoginComponent } from "./login.component"

describe("LoginComponent", () => {
  let component: LoginComponent
  let fixture: ComponentFixture<LoginComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        SharedModule,
        RouterTestingModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(LoginComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
