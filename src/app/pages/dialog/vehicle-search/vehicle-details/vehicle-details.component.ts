import { DialogRef, DIALOG_DATA } from "@angular/cdk/dialog"
import { Component, Inject, OnInit, Optional } from "@angular/core"
import { TRANSLOCO_SCOPE } from "@ngneat/transloco"
import { ViolationItem } from "src/app/shared/services/hcm.model"

@Component({
  selector: "app-vehicle-details",
  templateUrl: "./vehicle-details.component.html",
  styleUrls: ["./vehicle-details.component.scss"],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: "vehiclesearch",
      multi: true,
    },
  ],
})
export class VehicleDetailsComponent {
  constructor(
    @Optional() public dialogRef: DialogRef<VehicleDetailsComponent>,
    @Inject(DIALOG_DATA) public data: ViolationItem
  ) {}
}
