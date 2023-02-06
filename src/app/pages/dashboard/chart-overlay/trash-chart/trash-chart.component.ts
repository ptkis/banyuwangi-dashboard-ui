import { Component, Input } from "@angular/core"
import { Observable } from "rxjs"
import { ChartResponse, DashboardService } from "../../dashboard.service"

@Component({
  selector: "app-trash-chart",
  template: `
    <app-chart-component
      panelTitle="Sampah Jalan Raya & Sungai"
      [getChartData]="getData"
      [tooltipPosition]="tooltipPosition"
    ></app-chart-component>
  `,
})
export class TrashChartComponent {
  @Input() tooltipPosition: "left" | "right" = "right"

  getData: () => Observable<ChartResponse>

  constructor(private _dashboardService: DashboardService) {
    this.getData = _dashboardService.getTrashChartData
  }
}
