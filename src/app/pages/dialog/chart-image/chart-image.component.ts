import { SelectionModel } from "@angular/cdk/collections"
import { Dialog, DialogRef } from "@angular/cdk/dialog"
import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from "@angular/core"
import { MatDrawer } from "@angular/material/sidenav"
import { ActivatedRoute, Router } from "@angular/router"
import { TRANSLOCO_SCOPE } from "@ngneat/transloco"
import { finalize } from "rxjs"
import { ListFilterComponent } from "src/app/shared/components/list-filter/list-filter.component"
import {
  Annotation,
  ChartImageContent,
  DashboardService,
} from "../../dashboard/dashboard.service"
import { ImageCanvasComponent } from "../image-canvas/image-canvas.component"

@Component({
  selector: "app-chart-image",
  templateUrl: "./chart-image.component.html",
  styleUrls: ["./chart-image.component.scss"],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: "dashboard" }],
})
export class ChartImageComponent implements AfterViewInit, OnInit {
  @ViewChild("content") contentRef!: TemplateRef<HTMLDivElement>
  @ViewChild("filter") filterDrawer!: MatDrawer
  @ViewChild("listFilterCamera") listFilterCamera!: ListFilterComponent
  @ViewChild("listFilterLocation") listFilterLocation!: ListFilterComponent

  @ViewChildren(ImageCanvasComponent)
  imageCanvas!: QueryList<ImageCanvasComponent>

  isLoading = false
  dialogRef!: DialogRef<string>
  imageData: ChartImageContent<Annotation>[] = []
  displayedImageData: ChartImageContent<Annotation>[] = []
  paginator = {
    index: 0,
    length: 10,
    size: Number(sessionStorage.getItem("size") || 100),
    last: false,
  }
  type = "trash"

  allLocations: string[] = []
  selectedLocations: string[] = []
  selectedFilterLocations: string[] = []

  allCameras: string[] = []
  selectedCameras: string[] = []
  selectedFilterCameras: string[] = []

  allLocationNested: Record<string, string[]> = {}

  isFilterActive = false

  constructor(
    public dialog: Dialog,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    const type = this.route.snapshot.queryParamMap.get("type")
    if (type) {
      this.type = type
    }
    this.loadData()
  }

  ngAfterViewInit(): void {
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
        type: this.type?.toUpperCase(),
        ...(sessionStorage.getItem("startDate")
          ? { startDate: sessionStorage.getItem("startDate") }
          : {}),
        ...(sessionStorage.getItem("endDate")
          ? { endDate: sessionStorage.getItem("endDate") }
          : {}),
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((resp) => {
        this.paginator = {
          index: resp.data.number,
          length: resp.data.totalElements,
          size: this.paginator.size,
          last: resp.data.last,
        }
        this.imageData = [...this.imageData, ...resp.data.content]
        this.initializeFilter(this.imageData)
      })
  }

  initializeFilter(data: typeof this.imageData) {
    this.displayedImageData = data
    const tmp: typeof this.allLocationNested = {}
    for (const item of data) {
      tmp[item.location] = [
        ...new Set(
          data
            .filter((d1) => d1.location === item.location)
            .map((d2) => d2.cameraName)
        ),
      ]
    }
    this.allLocationNested = tmp
    this.allLocations = Object.keys(tmp)
    this.selectedLocations = this.allLocations
    this.allCameras = this.getCameras(this.selectedLocations)
    this.selectedCameras = this.allCameras
  }

  onIntersection(e: IntersectionObserverEntry[]) {
    // console.log(e)
    if (e?.[0].isIntersecting) {
      this.loadData(true)
    }
  }

  applyFilter() {
    const filterCamera = this.listFilterCamera.selectedItems.selected
    const filterLocation = this.listFilterLocation.selectedItems.selected
    this.selectedFilterLocations = filterLocation
    this.selectedFilterCameras = filterCamera
    this.displayedImageData = this.imageData.filter(
      (d) =>
        filterLocation.includes(d.location) &&
        filterCamera.includes(d.cameraName)
    )
    this.filterDrawer.close()
    if (
      filterLocation.length < this.allLocations.length ||
      filterCamera.length < this.allCameras.length
    ) {
      this.isFilterActive = true
    } else {
      this.isFilterActive = false
    }
  }

  getCameras(selectedLocations: string[]) {
    const arr = Object.keys(this.allLocationNested)
      .filter((key) => selectedLocations.includes(key))
      .map((key) => this.allLocationNested[key])
    return arr.reduce((acc, curVal) => {
      return acc.concat(curVal)
    }, [])
  }

  filterLocation(selectedLocations: string[]) {
    this.allCameras = this.getCameras(selectedLocations)
    this.selectedCameras = this.allCameras
  }

  downloadImages() {
    // const selected: ImageCanvasComponent[] = []
    for (const image of this.imageCanvas) {
      if (image.selected) {
        // selected.push(image)
        image.exportImage()
      }
    }
  }
}
