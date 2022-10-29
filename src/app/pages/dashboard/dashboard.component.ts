import { Component, OnInit, ViewEncapsulation } from "@angular/core"
import { Dialog, DialogRef, DIALOG_DATA } from "@angular/cdk/dialog"
import { DialogPencarianComponent } from "./dialogs/dialog-pencarian/dialog-pencarian.component"
import { DialogPencarianKendaraanComponent } from "./dialogs/dialog-pencarian-kendaraan/dialog-pencarian-kendaraan.component"
import { DialogPencarianOrangComponent } from "./dialogs/dialog-pencarian-orang/dialog-pencarian-orang.component"

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  constructor(public dialog: Dialog) {}

  ngOnInit(): void {
    this.openDialog()
  }

  openDialog(): void {
    const dialogRef = this.dialog.open<string>(DialogPencarianOrangComponent, {
      width: "891px",
    })

    // dialogRef.closed.subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
}
