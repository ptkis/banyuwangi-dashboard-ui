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
import { DATE_FORMAT } from "src/app/shared/constants/app.constants"
import { colorTypes } from "src/app/shared/services/hcm.constants"
import { ViolationItem } from "src/app/shared/services/hcm.model"
import { HCMService } from "src/app/shared/services/hcm.service"
import { ModalService } from "src/app/shared/services/modal.service"
import { environment } from "src/environments/environment"
import { VehicleDetailsComponent } from "./vehicle-details/vehicle-details.component"

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
  vehicleColor: string | null = null
  qtype: string | null = null

  searchForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    plateNo: new FormControl<string | null>(null),
    vehicleColor: new FormControl<string | null>(""),
    qtype: new FormControl<string>("0"),
  })

  params: Record<string, string | null> = {}

  colorTypes = colorTypes
  qtypes = ["vehiclepass", "vehiclealarm"]

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
      const vehicleColor = params.get("vehicleColor")
      const qtype = params.get("qtype")

      if (startDate && endDate) {
        this.startDate = startDate
        this.endDate = endDate
      }

      this.plateNo = plateNo
      this.vehicleColor = vehicleColor
      this.qtype = qtype

      const qparams = {
        startDate: this.startDate,
        endDate: this.endDate,
        plateNo: this.plateNo,
        vehicleColor: this.vehicleColor,
        queryType: this.qtypes[+(qtype || "0")],
      }

      this.getVehicleData(qparams)
    })
  }

  handlePageEvent(e: PageEvent) {
    this.getVehicleData(this.params, e.pageIndex + 1, e.pageSize)
  }

  getVehicleData(params: Record<string, string | null>, page = 1, size = 10) {
    this.params = params
    const { startDate, endDate, plateNo, vehicleColor, qtype } = params
    if (startDate && endDate) {
      this.searchForm.patchValue({
        start: new Date(startDate),
        end: new Date(endDate),
        qtype,
      })
    }
    if (plateNo) {
      this.searchForm.patchValue({
        plateNo,
      })
    }
    if (vehicleColor) {
      this.searchForm.patchValue({
        vehicleColor,
      })
    }
    this._HCMService.getVehicleData(this.params, page, size).subscribe({
      next: (resp) => {
        if (resp.data?.items?.length) {
          this.dataSource = resp.data.items

          this.paginator = {
            index: resp.data.metadata.pageNo - 1,
            // length: resp.data.metadata.totalCount,
            length: 9_999_999,
            size,
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
      timeOut: environment.toast.errorTimeout,
    })
  }

  viewData(data: ViolationItem) {
    this.dialog.open(VehicleDetailsComponent, {
      data,
      width: "1290px",
    })
  }

  search() {
    const { start, end, plateNo, vehicleColor, qtype } = this.searchForm.value
    const data: Record<string, string> = {}
    if (start && end) {
      data["startDate"] = format(start, DATE_FORMAT)
      data["endDate"] = format(end, DATE_FORMAT)
    }
    data["qtype"] = qtype || "0"

    if (plateNo) {
      data["plateNo"] = plateNo
    }
    if (vehicleColor) {
      data["vehicleColor"] = vehicleColor
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: data,
    })
  }

  getImageProxy(uri: string) {
    return this._HCMService.getImageFromProxy(uri)
  }
}
