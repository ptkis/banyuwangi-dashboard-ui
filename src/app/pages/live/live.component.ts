import { CommonModule } from "@angular/common"
import { Component } from "@angular/core"
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { DashboardModule } from "src/app/pages/dashboard/dashboard.module"

@Component({
  selector: "app-live",
  templateUrl: "./live.component.html",
  styleUrls: ["./live.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    DashboardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
  ],
})
export class LiveComponent {
  searchForm = new FormGroup({
    search: new FormControl<string>(""),
    detection: new FormControl<string>(""),
    location: new FormControl<string>(""),
  })

  detections = [
    {
      value: "",
      label: "Semua",
    },
  ]
  locations = [
    {
      value: "",
      label: "Semua",
    },
  ]

  search() {}
}
