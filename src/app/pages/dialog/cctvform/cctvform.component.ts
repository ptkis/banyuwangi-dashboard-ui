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
    vmsCameraIndexCode: [this.data?.row?.vmsCameraIndexCode],
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
    maxFlood: [this.data?.row?.alarmSetting?.maxFlood],
    maxTrash: [this.data?.row?.alarmSetting?.maxTrash],
    maxStreetvendor: [this.data?.row?.alarmSetting?.maxStreetvendor],
    maxCrowd: [this.data?.row?.alarmSetting?.maxCrowd],
    maxTraffic: [this.data?.row?.alarmSetting?.maxTraffic],
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
      let data = <CCTVData>this.cameraForm.value
      delete (data as any)["maxFlood"]
      delete (data as any)["maxTrash"]
      delete (data as any)["maxStreetvendor"]
      delete (data as any)["maxCrowd"]
      delete (data as any)["maxTraffic"]
      data = {
        ...data,
        alarmSetting: {
          maxFlood: this.cameraForm.get("maxFlood")?.value || null,
          maxTrash: this.cameraForm.get("maxTrash")?.value || null,
          maxStreetvendor:
            this.cameraForm.get("maxStreetvendor")?.value || null,
          maxCrowd: this.cameraForm.get("maxCrowd")?.value || null,
          maxTraffic: this.cameraForm.get("maxTraffic")?.value || null,
        },
      }
      this.formSubmit.emit(data)
    }
  }
}
