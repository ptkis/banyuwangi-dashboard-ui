import {
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core"

@Component({
  selector: "app-chart-panel",
  templateUrl: "./chart-panel.component.html",
  styleUrls: ["./chart-panel.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ChartPanelComponent implements OnInit {
  @Input() title = ""

  @ContentChild("customTitle", { static: false })
  titleTemplateRef!: TemplateRef<any>
  @ContentChild("contentBody", { static: false })
  bodyTemplateRef!: TemplateRef<any>

  constructor() {}

  ngOnInit(): void {
    undefined
  }
}
