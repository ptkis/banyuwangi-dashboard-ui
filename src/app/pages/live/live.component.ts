import { CommonModule } from "@angular/common"
import { Component, OnInit, inject, ViewEncapsulation } from "@angular/core"
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { DashboardModule } from "src/app/pages/dashboard/dashboard.module"
import { CCTVData, LiveService } from "src/app/pages/live/live.service"
import { ScrollingModule } from "@angular/cdk/scrolling"
import { HikVideo2Component } from "src/app/shared/components/hik-video-2/hik-video-2.component"
import { finalize } from "rxjs"

@Component({
  selector: "app-live",
  templateUrl: "./live.component.html",
  styleUrls: ["./live.component.scss"],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    DashboardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    ScrollingModule,
    HikVideo2Component,
  ],
})
export class LiveComponent implements OnInit {
  service = inject(LiveService)

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

  CCTVLists: CCTVData[][] = []

  isLoading = false

  search() {}

  chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunkedArray: T[][] = []

    for (let i = 0; i < array.length; i += chunkSize) {
      chunkedArray.push(array.slice(i, i + chunkSize))
    }

    return chunkedArray
  }

  ngOnInit(): void {
    this.isLoading = true
    this.service
      .getCCTVList()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((resp) => {
        this.CCTVLists = this.chunkArray(resp.data, 3)
      })
  }
}
