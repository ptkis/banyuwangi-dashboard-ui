import { Dialog, DialogRef } from "@angular/cdk/dialog"
import { HttpErrorResponse } from "@angular/common/http"
import {
  Component,
  AfterViewInit,
  TemplateRef,
  ViewChild,
  NgZone,
} from "@angular/core"
import { FormControl, FormGroup } from "@angular/forms"
import { PageEvent } from "@angular/material/paginator"
import { ActivatedRoute, Router } from "@angular/router"
import { TRANSLOCO_SCOPE } from "@ngneat/transloco"
import { format, subDays } from "date-fns"
import { ToastrService } from "ngx-toastr"
import { ViolationItem } from "src/app/shared/services/hcm.model"
import { HCMService } from "src/app/shared/services/hcm.service"
import { ModalService } from "src/app/shared/services/modal.service"
import { VehicleDetailsComponent } from "./vehicle-details/vehicle-details.component"

const DATE_FORMAT = "yyyy-MM-dd"

@Component({
  selector: "app-vehicle-search",
  templateUrl: "./vehicle-search.component.html",
  styleUrls: ["./vehicle-search.component.scss"],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: "vehiclesearch",
      multi: true,
    },
    {
      provide: TRANSLOCO_SCOPE,
      useValue: "dashboard",
      multi: true,
    },
  ],
})
export class VehicleSearchComponent implements AfterViewInit {
  @ViewChild("content") contentRef!: TemplateRef<HTMLDivElement>

  isLoading = false
  dialogRef!: DialogRef<string>

  dataSource: ViolationItem[] = []
  displayedColumns = [
    "position",
    "passTime",
    "crossingName",
    // 'directionName',
    "plateColorName",
    "vehicleTypeName",
    "vehicleColorName",
    "violativeActionName",
    "plateNo",
    "plateImagePath",
    "imagePath",
    "action",
  ]
  paginator = {
    index: 0,
    length: 10,
    size: 20,
  }

  startDate = format(subDays(new Date(), 30), DATE_FORMAT)
  endDate = format(new Date(), DATE_FORMAT)
  plateNo: string | null = null

  searchForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    plateNo: new FormControl<string | null>(null),
  })

  params: Record<string, string | null> = {}

  constructor(
    private _HCMService: HCMService,
    public dialog: Dialog,
    public modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit(): void {
    this.dialogRef = this.dialog.open<string, HTMLDivElement>(this.contentRef, {
      width: "1290px",
      disableClose: true,
      closeOnNavigation: true,
    })
    this.dialogRef.closed.subscribe(() => {
      this.zone.run(() => {
        this.router.navigate(["", { outlets: { dialog: null } }])
      })
    })

    this.route.queryParamMap.subscribe((params) => {
      const startDate = params.get("startDate")
      const endDate = params.get("endDate")
      const plateNo = params.get("plateNo")

      if (startDate && endDate) {
        this.startDate = startDate
        this.endDate = endDate
      }

      this.plateNo = plateNo

      const qparams = {
        startDate: this.startDate,
        endDate: this.endDate,
        plateNo: this.plateNo,
      }

      this.getVehicleData(qparams)
    })
  }

  handlePageEvent(e: PageEvent) {
    this.getVehicleData(this.params, e.pageIndex + 1, e.pageSize)
  }

  getVehicleData(params: Record<string, string | null>, page = 1, size = 10) {
    this.params = params
    const { startDate, endDate, plateNo } = params
    if (startDate && endDate) {
      this.searchForm.patchValue({
        start: new Date(startDate),
        end: new Date(endDate),
      })
    }
    if (plateNo) {
      this.searchForm.patchValue({
        plateNo,
      })
    }
    this._HCMService.getVehicleData(this.params, page, size).subscribe({
      next: (resp) => {
        if (resp.data?.items?.length) {
          this.dataSource = resp.data.items

          this.paginator = {
            index: resp.data.metadata.pageNo - 1,
            length: resp.data.metadata.totalCount,
            size: resp.data.metadata.pageSize,
          }
        } else {
          this.dataSource = []
        }
      },
      error: (err: HttpErrorResponse) => {
        const message = err.error?.message || "Failed to load data"
        this.showError(message, "Network Error")
      },
    })
  }

  showError(message: string, title?: string) {
    return this.toastr.error(message, title || "Error", {
      disableTimeOut: true,
    })
  }

  viewData(data: ViolationItem) {
    this.dialog.open(VehicleDetailsComponent, {
      data,
      width: "1290px",
    })
  }

  search() {
    const { start, end, plateNo } = this.searchForm.value
    const data: Record<string, string> = {}
    if (start && end) {
      data["startDate"] = format(start, DATE_FORMAT)
      data["endDate"] = format(end, DATE_FORMAT)
    }

    if (plateNo) {
      data["plateNo"] = plateNo
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: data,
    })
  }
}
