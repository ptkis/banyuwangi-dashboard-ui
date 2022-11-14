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
import { AuthGuard } from "src/app/shared/guards/auth.guard"

import { VgCoreModule } from "@videogular/ngx-videogular/core"
import { VgControlsModule } from "@videogular/ngx-videogular/controls"
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play"
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering"
import { VgStreamingModule } from "@videogular/ngx-videogular/streaming"
import { HttpClientModule } from "@angular/common/http"

export const dashboardRoutes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    // canActivate: [AuthGuard],
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
    HttpClientModule,

    SharedModule,
    RouterModule.forChild(dashboardRoutes),
    NgxEchartsModule.forChild(),
    MatButtonModule,
    MatIconModule,
    DialogModule,

    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,
  ],
})
export class DashboardModule {}
