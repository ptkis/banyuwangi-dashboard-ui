import {
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
} from "@angular/core"

@Component({
  selector: "app-dialog-pencarian",
  templateUrl: "./dialog-pencarian.component.html",
  styleUrls: ["./dialog-pencarian.component.scss"],
})
export class DialogPencarianComponent {
  @Input() title = "Empty"

  @ContentChild("belowImage", { static: false })
  belowImageTemplateRef!: TemplateRef<any>
  @ContentChild("topContent", { static: false })
  topSectionTemplateRef!: TemplateRef<any>
  @ContentChild("bottomContent", { static: false })
  bottomSectionTemplateRef!: TemplateRef<any>

  constructor() {}
}
