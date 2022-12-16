import { SelectionModel } from "@angular/cdk/collections"
import { Dialog, DialogRef } from "@angular/cdk/dialog"
import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core"
import { MatDrawer } from "@angular/material/sidenav"
import { ActivatedRoute, Router } from "@angular/router"
import { TRANSLOCO_SCOPE } from "@ngneat/transloco"
import { finalize } from "rxjs"
import {
  ChartImageContent,
  DashboardService,
} from "../../dashboard/dashboard.service"

@Component({
  selector: "app-chart-image",
  templateUrl: "./chart-image.component.html",
  styleUrls: ["./chart-image.component.scss"],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: "dashboard" }],
})
export class ChartImageComponent implements AfterViewInit, OnInit {
  @ViewChild("content") contentRef!: TemplateRef<HTMLDivElement>
  @ViewChild("filter") filterDrawer!: MatDrawer

  isLoading = false
  dialogRef!: DialogRef<string>
  imageData: ChartImageContent[] = []
  paginator = {
    index: 0,
    length: 10,
    size: 9,
    last: false,
  }
  type = "trash"

  allLocations: string[] = []
  selectedLocations = new SelectionModel<string>(true, [])

  allCameras: string[] = []
  selectedCameras = new SelectionModel<string>(true, [])

  constructor(
    public dialog: Dialog,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadData()
  }

  ngAfterViewInit(): void {
    const type = this.route.snapshot.queryParamMap.get("type")
    if (type) {
      this.type = type
    }
    this.dialogRef = this.dialog.open<string, HTMLDivElement>(this.contentRef, {
      width: "1335px",
    })
    this.dialogRef.closed.subscribe(() => {
      this.zone.run(() => {
        this.router.navigate(["", { outlets: { dialog: null } }])
      })
    })
  }

  loadData(nextPage = false) {
    this.isLoading = true
    let pageNo = this.paginator.index + 1
    if (nextPage) {
      pageNo += 1
    }
    this.dashboardService
      .getDetectionChartData(pageNo, this.paginator.size, {
        type: this.type,
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((resp) => {
        this.paginator = {
          index: resp.data.number,
          length: resp.data.totalElements,
          size: resp.data.numberOfElements,
          last: resp.data.last,
        }
        this.imageData = [...this.imageData, ...resp.data.content]
        this.initializeFilter(this.imageData)
      })
  }

  initializeFilter(data: typeof this.imageData) {
    this.allLocations = [...new Set(data?.map((d) => d.location) || [])]
    this.allCameras = [...new Set(data?.map((d) => d.cameraName) || [])]
  }

  onIntersection(e: IntersectionObserverEntry[]) {
    // console.log(e)
    if (e?.[0].isIntersecting) {
      this.loadData(true)
    }
  }

  locationFilterChanged(items: string[]) {}
}
