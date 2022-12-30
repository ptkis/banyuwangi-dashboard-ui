import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Routes } from "@angular/router"
import { AuthGuard } from "src/app/shared/guards/auth.guard"
import { SharedModule } from "src/app/shared/shared.module"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"

import { DialogModule as CDKDialogModule } from "@angular/cdk/dialog"
import { MatTableModule } from "@angular/material/table"
import { MatInputModule } from "@angular/material/input"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatPaginatorModule } from "@angular/material/paginator"
import { CCTVFormComponent } from "./cctvform/cctvform.component"
import { CCTVListComponent } from "./cctvlist/cctvlist.component"
import { MatSelectModule } from "@angular/material/select"
import { TranslocoModule } from "@ngneat/transloco"
import { ImageCanvasComponent } from "./image-canvas/image-canvas.component"
import { ChartImageComponent } from "./chart-image/chart-image.component"
import { IntersectionObserverModule } from "@ng-web-apis/intersection-observer"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSidenavModule } from "@angular/material/sidenav"
import { ListFilterComponent } from "src/app/shared/components/list-filter/list-filter.component"
import { ChartImageSingleComponent } from "./chart-image-single/chart-image-single.component"
import { ChartDataComponent } from "./chart-data/chart-data.component"
import { MatDatepickerModule } from "@angular/material/datepicker"
import {
  MatDateFnsModule,
  MAT_DATE_FNS_FORMATS,
} from "@angular/material-date-fns-adapter"
import { id } from "date-fns/locale"
import { MAT_DATE_LOCALE } from "@angular/material/core"
import { VehicleSearchComponent } from "./vehicle-search/vehicle-search.component"
import { VehicleDetailsComponent } from "./vehicle-search/vehicle-details/vehicle-details.component"

export const dialogRoutes: Routes = [
  {
    path: "cctv-list",
    component: CCTVListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "chart-image",
    component: ChartImageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "toast-chart-image",
    component: ChartImageSingleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "chart-data",
    component: ChartDataComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "vehicle",
    component: VehicleSearchComponent,
    // canActivate: [AuthGuard],
  },
]

export const MY_FORMATS = {
  parse: {
    dateInput: "PPP",
  },
  display: {
    dateInput: "PPP",
    monthYearLabel: "LLL yyyy",
    dateA11yLabel: "PP",
    monthYearA11yLabel: "LLL yyyy",
  },
}

@NgModule({
  declarations: [
    CCTVListComponent,
    CCTVFormComponent,
    ImageCanvasComponent,
    ChartImageComponent,
    ChartImageSingleComponent,
    ChartDataComponent,
    VehicleSearchComponent,
    VehicleDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(dialogRoutes),
    SharedModule,
    MatButtonModule,
    MatIconModule,
    CDKDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    IntersectionObserverModule,
    MatProgressSpinnerModule,
    MatSidenavModule,

    ListFilterComponent,
    MatDatepickerModule,
    MatDateFnsModule,
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: id,
    },
    {
      provide: MAT_DATE_FNS_FORMATS,
      useValue: MY_FORMATS,
    },
  ],
})
export class DialogModule {}
