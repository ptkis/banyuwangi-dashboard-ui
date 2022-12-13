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
import { CameraViewComponent } from "./camera-view/camera-view.component"
import { CCTVFormComponent } from "./cctvform/cctvform.component"
import { CCTVListComponent } from "./cctvlist/cctvlist.component"
import { MatSelectModule } from "@angular/material/select"

export const dialogRoutes: Routes = [
  {
    path: "cctv-list",
    component: CCTVListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "camera-view",
    component: CameraViewComponent,
    // canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [CameraViewComponent, CCTVListComponent, CCTVFormComponent],
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
  ],
})
export class DialogModule {}
