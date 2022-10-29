import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { SharedModule } from "src/app/shared/shared.module"
import { DashboardComponent } from "./dashboard.component"
import { NgxEchartsModule } from "ngx-echarts"

import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
  },
]

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    NgxEchartsModule.forChild(),
    MatButtonModule,
    MatIconModule,
  ],
})
export class DashboardModule {}
