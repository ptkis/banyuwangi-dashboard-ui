import { Component, OnInit } from "@angular/core"
import { Dialog } from "@angular/cdk/dialog"
import { DialogPencarianKendaraanComponent } from "../dialogs/dialog-pencarian-kendaraan/dialog-pencarian-kendaraan.component"
import { DialogPencarianOrangComponent } from "../dialogs/dialog-pencarian-orang/dialog-pencarian-orang.component"

@Component({
  selector: "app-map3d-dashboard",
  templateUrl: "./map3d-dashboard.component.html",
  styleUrls: ["./map3d-dashboard.component.scss"],
})
export class Map3dDashboardComponent {
  constructor(private dialog: Dialog) {}

  openDialogKendaraan() {
    this.dialog.open<string>(DialogPencarianKendaraanComponent, {
      width: "891px",
    })
  }

  openDialogOrang() {
    this.dialog.open<string>(DialogPencarianOrangComponent, {
      width: "891px",
    })
  }
}
