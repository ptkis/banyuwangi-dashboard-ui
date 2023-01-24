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
import {
  DATE_FORMAT,
  EnumHCPGenderType,
  HCP_ALL_CAMERA_ID,
} from "src/app/shared/constants/app.constants"
import { HCPService, PersonData } from "src/app/shared/services/hcp.service"
import { HcpPictureComponent } from "./hcp-picture/hcp-picture.component"

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
  errorCode = ""
  dialogRef!: DialogRef<string>

  personDataList: PersonData[] = []

  searchForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    cameraIndexCode: new FormControl<string | null>(null),
    genderType: new FormControl<string>("0"),
  })

  startTime = format(subDays(new Date(), 1), DATE_FORMAT)
  endTime = format(new Date(), DATE_FORMAT)
  cameraIndexCodes = ["1238"]
  genderType = "0"

  allCameraIndexCodes = HCP_ALL_CAMERA_ID

  allGenderTypes = [
    {
      value: EnumHCPGenderType.ALL,
      label: "all",
    },
    {
      value: EnumHCPGenderType.MALE,
      label: "male",
    },
    {
      value: EnumHCPGenderType.FEMALE,
      label: "female",
    },
  ]

  genderTypeOutput: Record<string, string> = {
    "1": "male",
    "2": "female",
    "3": "unknown",
  }

  image: File | undefined = undefined
  imageData: { type: string; base64: string } | undefined

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
      const genderType = params.get("genderType")

      if (startTime && endTime) {
        this.startTime = startTime
        this.endTime = endTime
      }

      this.cameraIndexCodes = [cameraIndexCode || "1238"]
      this.genderType = genderType || this.genderType

      const qparams = {
        startTime: formatISO(
          startOfDay(parse(this.startTime, DATE_FORMAT, new Date()))
        ),
        endTime: formatISO(
          endOfDay(parse(this.endTime, DATE_FORMAT, new Date()))
        ),
        cameraIndexCodes: this.allCameraIndexCodes,
        genderType: +this.genderType,
      }

      this.searchForm.setValue({
        start: parseISO(qparams.startTime),
        end: parseISO(qparams.endTime),
        cameraIndexCode: this.cameraIndexCodes[0],
        genderType: this.genderType,
      })

      this.loadData(qparams)
    })
  }

  loadData(rawParams: Record<string, any>) {
    this.isLoading = true
    const params = {
      ...rawParams,
    }
    if (this.imageData?.base64) {
      // params['picData'] = this.imageSrc
      params["picData"] = this.imageData.base64
      params["similarity"] = "10.5"
    }
    this.errorCode = ""
    this.errorMessage = ""
    this.hcpService
      .personSearch(params)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (resp) => {
          if (!resp.data?.list) {
            this.personDataList = []
            if (typeof resp.data.total === "undefined") {
              this.errorMessage = resp.msg
            }
          } else {
            this.personDataList = resp.data.list
          }
        },
        error: (err: HttpErrorResponse) => {
          this.errorCode = err.statusText
        },
      })
  }

  onIntersection(e: IntersectionObserverEntry[], picture: HcpPictureComponent) {
    if (e?.[0].isIntersecting) {
      picture.loadImage()
    }
  }

  search() {
    const { start, end, genderType } = this.searchForm.value
    const data: Record<string, string> = {}
    if (start && end) {
      data["startTime"] = format(start, DATE_FORMAT)
      data["endTime"] = format(end, DATE_FORMAT)
    }

    data["genderType"] = genderType || "0"

    data["refid"] = new Date().getTime() + ""

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: data,
    })
  }

  readImage(file: File | undefined) {
    return new Promise<{
      type: string
      base64: string
    }>((resolve, reject) => {
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            resolve({
              type: file.type,
              base64: window.btoa(reader.result as string),
            })
          } catch (error) {
            reject(error)
          }
        }
        reader.readAsBinaryString(file)
      } else {
        reject("Not an image")
      }
    })
  }

  async selectImage(file: File | null | undefined) {
    if (file) {
      await this.readFile(file)
    }
  }

  async readFile(file: File) {
    this.image = file
    this.imageData = await this.readImage(this.image)
  }

  get imageSrc() {
    if (!this.imageData) {
      return null
    }
    return `data:${this.imageData?.type};base64,${this.imageData?.base64}`
  }

  onDrop(event: DragEvent) {
    event.preventDefault()
    if (event?.dataTransfer?.files?.length) {
      this.readFile(event.dataTransfer.files?.[0])
    }
  }

  onDragOver(event: Event) {
    event.stopPropagation()
    event.preventDefault()
  }

  resetForm() {
    this.image = undefined
    this.imageData = undefined
  }

  downloadImages() {
    for (const image of this.hcpImages) {
      if (image.imageCanvasComponent.selected) {
        // selected.push(image)
        image.imageCanvasComponent.exportImage(image.data?.captureTime || "")
      }
    }
  }
}
