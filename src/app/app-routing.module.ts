import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AppComponent } from "./app.component"
import { HeaderLayoutComponent } from "./layout/header-layout/header-layout.component"

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "",
    component: HeaderLayoutComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./pages/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
    ],
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
