import { Dialog, DialogRef } from "@angular/cdk/dialog"
import { HttpErrorResponse } from "@angular/common/http"
import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from "@angular/core"
import { FormControl, FormGroup } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { TRANSLOCO_SCOPE } from "@ngneat/transloco"
import {
  endOfDay,
  format,
  formatISO,
  parse,
  parseISO,
  startOfDay,
  subDays,
} from "date-fns"
import { finalize } from "rxjs"
import { HcpPictureComponent } from "src/app/shared/components/hcp-picture/hcp-picture.component"
import {
  DATE_FORMAT,
  HCP_ALL_CAMERA_ID,
} from "src/app/shared/constants/app.constants"
import { HCPService, PersonData } from "src/app/shared/services/hcp.service"

@Component({
  selector: "app-person-search",
  templateUrl: "./person-search.component.html",
  styleUrls: ["./person-search.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: "personsearch",
      multi: true,
    },
    {
      provide: TRANSLOCO_SCOPE,
      useValue: "dashboard",
      multi: true,
    },
  ],
})
export class PersonSearchComponent implements AfterViewInit {
  @ViewChild("content") contentRef!: TemplateRef<HTMLDivElement>

  @ViewChildren(HcpPictureComponent)
  hcpImages!: QueryList<HcpPictureComponent>

  isLoading = false
  errorMessage = ""
  dialogRef!: DialogRef<string>

  personDataList: PersonData[] = []

  searchForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    cameraIndexCode: new FormControl<string | null>(null),
  })

  startTime = format(subDays(new Date(), 1), DATE_FORMAT)
  endTime = format(new Date(), DATE_FORMAT)
  cameraIndexCodes = ["1238"]

  allCameraIndexCodes = HCP_ALL_CAMERA_ID

  constructor(
    public dialog: Dialog,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private hcpService: HCPService
  ) {}

  ngAfterViewInit(): void {
    this.dialogRef = this.dialog.open<string, HTMLDivElement>(this.contentRef, {
      width: "1335px",
    })
    this.dialogRef.closed.subscribe(() => {
      this.zone.run(() => {
        this.router.navigate(["", { outlets: { dialog: null } }])
      })
    })

    this.route.queryParamMap.subscribe((params) => {
      const startTime = params.get("startTime")
      const endTime = params.get("endTime")
      const cameraIndexCode = params.get("cameraIndexCode")

      if (startTime && endTime) {
        this.startTime = startTime
        this.endTime = endTime
      }

      this.cameraIndexCodes = [cameraIndexCode || "1238"]

      const qparams = {
        startTime: formatISO(
          startOfDay(parse(this.startTime, DATE_FORMAT, new Date()))
        ),
        endTime: formatISO(
          endOfDay(parse(this.endTime, DATE_FORMAT, new Date()))
        ),
        cameraIndexCodes: this.allCameraIndexCodes,
      }

      this.searchForm.setValue({
        start: parseISO(qparams.startTime),
        end: parseISO(qparams.endTime),
        cameraIndexCode: this.cameraIndexCodes[0],
      })

      this.loadData(qparams)
    })
  }

  loadData(params: Record<string, any>) {
    this.isLoading = true
    this.hcpService
      .personSearch(params)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (resp) => {
          this.personDataList = resp.data.list
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.statusText
        },
      })
  }

  onIntersection(e: IntersectionObserverEntry[], picture: HcpPictureComponent) {
    if (e?.[0].isIntersecting) {
      picture.loadImage()
    }
  }

  search() {
    const { start, end, cameraIndexCode } = this.searchForm.value
    const data: Record<string, string> = {}
    if (start && end) {
      data["startTime"] = format(start, DATE_FORMAT)
      data["endTime"] = format(end, DATE_FORMAT)
    }

    if (cameraIndexCode) {
      data["cameraIndexCode"] = cameraIndexCode
    }

    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: data,
      })
      .then((a) => console.log("a"))
  }
}
