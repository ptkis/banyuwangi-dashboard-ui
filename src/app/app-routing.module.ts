import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AuthGuard } from "src/app/shared/guards/auth.guard"
const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "live",
    canActivate: [AuthGuard],
    loadComponent: () =>
      import("./pages/live/live.component").then((m) => m.LiveComponent),
  },
  {
    path: "statistik",
    canActivate: [AuthGuard],
    loadComponent: () =>
      import("./pages/statistik/statistik.component").then(
        (m) => m.StatistikComponent
      ),
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./pages/dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginModule),
  },
  {
    path: "",
    outlet: "dialog",
    loadChildren: () =>
      import("./pages/dialog/dialog.module").then((m) => m.DialogModule),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
