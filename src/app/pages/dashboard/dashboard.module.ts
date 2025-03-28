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
import { dashboardDialogs } from "./dialogs"
import { AuthGuard } from "src/app/shared/guards/auth.guard"

import { HttpClientModule } from "@angular/common/http"
import { MatMenuModule } from "@angular/material/menu"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { CdkListboxModule } from "@angular/cdk/listbox"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { TranslocoModule, TRANSLOCO_SCOPE } from "@ngneat/transloco"
import { ListFilterComponent } from "src/app/shared/components/list-filter/list-filter.component"
import { HeaderComponent } from "src/app/pages/dashboard/components/header/header.component"
import { TuiLetModule } from "@taiga-ui/cdk"
import { HikVideo2Component } from "../../shared/components/hik-video-2/hik-video-2.component"

export const dashboardRoutes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        component: MapDashboardComponent,
      },
      {
        path: ":type",
        component: MapDashboardComponent,
      },
    ],
  },
]

export const dashboardMaterialModules = [
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  CdkListboxModule,
  MatCheckboxModule,
  MatInputModule,
  MatCheckboxModule,
  MatFormFieldModule,
  DialogModule,
  TuiLetModule,
]

@NgModule({
  declarations: [dashboardComponents, dashboardDialogs],
  imports: [
    CommonModule,
    HttpClientModule,

    SharedModule,
    RouterModule.forChild(dashboardRoutes),
    NgxEchartsModule.forChild(),

    dashboardMaterialModules,

    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,

    ListFilterComponent,
    HikVideo2Component,
    HikVideo2Component,
  ],
  exports: [HeaderComponent],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: "dashboard",
    },
  ],
})
export class DashboardModule {}
