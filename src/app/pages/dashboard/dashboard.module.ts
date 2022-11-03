import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { SharedModule } from "src/app/shared/shared.module"
import { DashboardComponent } from "./dashboard.component"
import { NgxEchartsModule } from "ngx-echarts"
import { dashboardComponents } from "./index"

import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { DialogModule } from "@angular/cdk/dialog"

import { MapDashboardComponent } from "./map-dashboard/map-dashboard.component"
import { Map3dDashboardComponent } from "./map3d-dashboard/map3d-dashboard.component"
import { dashboardDialogs } from "./dialogs"

export const dashboardRoutes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      {
        path: "",
        component: MapDashboardComponent,
      },
      {
        path: "3d",
        component: Map3dDashboardComponent,
      },
    ],
  },
]

@NgModule({
  declarations: [dashboardComponents, dashboardDialogs],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(dashboardRoutes),
    NgxEchartsModule.forChild(),
    MatButtonModule,
    MatIconModule,
    DialogModule,
  ],
})
export class DashboardModule {}
