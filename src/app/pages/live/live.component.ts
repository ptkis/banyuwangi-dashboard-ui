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
import { Subscription, debounceTime, finalize } from "rxjs"
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"
import { TranslocoModule } from "@ngneat/transloco"

const ALL_PLACEHOLDER = "-ALL-"

@UntilDestroy()
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
    TranslocoModule,
  ],
})
export class LiveComponent implements OnInit {
  service = inject(LiveService)

  searchForm = new FormGroup({
    keyword: new FormControl<string>(""),
    type: new FormControl<string>(ALL_PLACEHOLDER),
    location: new FormControl<string | null>(ALL_PLACEHOLDER),
  })

  detections = [
    {
      value: ALL_PLACEHOLDER,
      label: "Semua",
    },
    {
      value: "FLOOD",
      label: "FLOOD",
    },
    {
      value: "TRASH",
      label: "TRASH",
    },
    {
      value: "STREETVENDOR",
      label: "STREETVENDOR",
    },
    {
      value: "CROWD",
      label: "CROWD",
    },
    {
      value: "TRAFFIC",
      label: "TRAFFIC",
    },
  ]
  locations: {
    value: string | null
    label: string
  }[] = [
    {
      value: null,
      label: "Semua",
    },
  ]

  CCTVLists: CCTVData[][] = []

  isLoading = false
  subscription: Subscription | undefined

  currentPage = 0
  sizePage = 30
  lastParams?: Record<string, any>

  search() {
    const value = this.searchForm.value
    for (const key of Object.keys(value)) {
      const obj = (value as any)[key]
      if (key === "keyword" && !obj) {
        delete (value as any)[key]
      } else if (
        typeof obj === "undefined" ||
        obj === null ||
        obj === ALL_PLACEHOLDER
      ) {
        delete (value as any)[key]
      }
    }
    this.loadCCTV(value)
  }

  chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunkedArray: T[][] = []

    for (let i = 0; i < array.length; i += chunkSize) {
      chunkedArray.push(array.slice(i, i + chunkSize))
    }

    return chunkedArray
  }

  ngOnInit(): void {
    this.service.getLocationList().subscribe((resp) => {
      this.locations = [
        {
          value: ALL_PLACEHOLDER,
          label: "Semua",
        },
        ...resp.data.map((loc) => ({
          value: loc,
          label: loc,
        })),
      ]
    })
    this.loadCCTV()

    this.searchForm.valueChanges
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe(this.search.bind(this))
  }

  loadCCTV(params?: Record<string, any>, page = 0) {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }

    this.isLoading = true
    this.lastParams = params
    this.service
      .getCCTVList({
        ...params,
      })
      .pipe(
        finalize(() => (this.isLoading = false)),
        untilDestroyed(this)
      )
      .subscribe((resp) => {
        const newData = this.chunkArray(resp.data, 3)
        if (page === 0) {
          this.CCTVLists = newData
        } else {
          this.CCTVLists = [...this.CCTVLists, ...newData]
        }
      })
  }
}
