import { DialogRef, DIALOG_DATA } from "@angular/cdk/dialog"
import {
  Component,
  EventEmitter,
  Inject,
  Optional,
  Output,
} from "@angular/core"
import { FormBuilder, FormControl, Validators } from "@angular/forms"
import { TRANSLOCO_SCOPE } from "@ngneat/transloco"
import { CCTVData } from "../cctvlist/cctvlist.service"

@Component({
  selector: "app-cctvform",
  templateUrl: "./cctvform.component.html",
  styleUrls: ["./cctvform.component.scss"],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: "cctvform" }],
})
export class CCTVFormComponent {
  @Output() formSubmit = new EventEmitter<CCTVData>()

  titles = {
    new: "Tambah Data",
    edit: "Edit Data",
    view: "Lihat Data",
  }

  formType: "new" | "edit" | "view" = "new"

  title = this.titles[this.formType]

  VMSType = ["HCP", "HCM"]

  CameraType = ["ONVIF", "HIKVISION"]

  cameraForm = this.fb.group({
    id: [this.data?.row?.id],
    vmsCameraIndexCode: [
      this.data?.row?.vmsCameraIndexCode,
      Validators.required,
    ],
    name: [this.data?.row?.name, Validators.required],
    vmsType: [this.data?.row?.vmsType || "HCP"],
    location: [this.data?.row?.location || ""],
    latitude: [this.data?.row?.latitude || 0],
    longitude: [this.data?.row?.longitude || 0],
    host: [this.data?.row?.host || ""],
    httpPort: [this.data?.row?.httpPort || 0],
    rtspPort: [this.data?.row?.rtspPort || 0],
    channel: [this.data?.row?.channel || ""],
    captureQualityChannel: [this.data?.row?.captureQualityChannel || ""],
    userName: [this.data?.row?.userName || ""],
    password: [this.data?.row?.password || ""],
    type: [this.data?.row?.type || "ONVIF"],
    label: [this.data?.row?.label || ""],
    isActive: [this.data?.row?.isActive ?? true],
    isCrowd: [this.data?.row?.isCrowd || false],
    isFlood: [this.data?.row?.isFlood || false],
    isStreetvendor: [this.data?.row?.isStreetvendor || false],
    isTraffic: [this.data?.row?.isTraffic || false],
    isTrash: [this.data?.row?.isTrash || false],
    version: [this.data?.row?.version || null],
  })

  constructor(
    private fb: FormBuilder,
    @Optional() public dialogRef: DialogRef<CCTVData>,
    @Optional()
    @Inject(DIALOG_DATA)
    public data: {
      row: CCTVData
      readonly?: boolean
    }
  ) {
    if (!data?.row) {
      this.formType = "new"
    } else if (data?.readonly) {
      this.formType = "view"
    } else {
      this.formType = "edit"
    }
    this.title = this.titles[this.formType]
  }

  submitForm() {
    this.cameraForm.markAllAsTouched()
    if (this.cameraForm.valid) {
      const data = <CCTVData>this.cameraForm.value
      this.formSubmit.emit(data)
    }
  }
}
