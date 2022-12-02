import { Component, Input } from "@angular/core"
import { Observable } from "rxjs"
import { ChartResponse, DashboardService } from "../../dashboard.service"

@Component({
  selector: "app-crowd-chart",
  template: `
    <app-chart-component
      panelTitle="Keramaian Orang"
      [getChartData]="getData"
      [tooltipPosition]="tooltipPosition"
    ></app-chart-component>
  `,
})
export class CrowdChartComponent {
  @Input() tooltipPosition: "left" | "right" | "top" = "right"

  getData: () => Observable<ChartResponse>

  constructor(private _dashboardService: DashboardService) {
    this.getData = _dashboardService.getCrowdChartData
  }
}
