import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { SharedModule } from "src/app/shared/shared.module"

import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { LoginComponent } from "./login.component"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

export const loginRoutes: Routes = [
  {
    path: "",
    component: LoginComponent,
    children: [
      {
        path: "",
        component: LoginComponent,
      },
    ],
  },
]

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(loginRoutes),
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class LoginModule {}
