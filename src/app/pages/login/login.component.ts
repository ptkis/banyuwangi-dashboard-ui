import { Component, NgZone, ViewEncapsulation } from "@angular/core"
import { FormBuilder, Validators } from "@angular/forms"
import { Router } from "@angular/router"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  hidePassword = true

  loginForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
    remember: [false, [Validators.required]],
  })

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private zone: NgZone
  ) {}

  formSubmit() {
    this.loginForm.markAllAsTouched()
    if (this.loginForm.valid) {
      this.zone.run(() => {
        this.router.navigateByUrl("/dashboard")
      })
    }
  }

  loginWithGoogle() {
    return false
  }
}
