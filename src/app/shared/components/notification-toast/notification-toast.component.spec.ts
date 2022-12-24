import { ComponentFixture, TestBed } from "@angular/core/testing"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import {
  IndividualConfig,
  ToastPackage,
  ToastRef,
  ToastrModule,
} from "ngx-toastr"

import { NotificationToastComponent } from "./notification-toast.component"

describe("NotificationToastComponent", () => {
  let component: NotificationToastComponent
  let fixture: ComponentFixture<NotificationToastComponent>

  class MockToastPackage extends ToastPackage {
    constructor() {
      const toastConfig = { toastClass: "customToast" }
      super(
        1,
        <IndividualConfig>toastConfig,
        "test message",
        "test title",
        "show",
        new ToastRef(null as any)
      )
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationToastComponent],
      imports: [NoopAnimationsModule, ToastrModule.forRoot()],
      providers: [{ provide: ToastPackage, useClass: MockToastPackage }],
    }).compileComponents()

    fixture = TestBed.createComponent(NotificationToastComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
