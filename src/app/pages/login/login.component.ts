import { Component, ViewEncapsulation } from "@angular/core"
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
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]],
    remember: [false, [Validators.required]],
  })

  constructor(private fb: FormBuilder, private router: Router) {}

  formSubmit() {
    this.loginForm.markAllAsTouched()
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)
      this.router.navigateByUrl("/dashboard")
    }
  }

  loginWithGoogle() {
    return false
  }
}
