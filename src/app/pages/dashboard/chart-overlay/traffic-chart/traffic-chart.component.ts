import { Component, Input, OnInit } from "@angular/core"
import { Observable } from "rxjs"
import { ChartResponse, DashboardService } from "../../dashboard.service"

@Component({
  selector: "app-traffic-chart",
  template: `
    <app-chart-component
      panelTitle="Kepadatan Lalu Lintas"
      [getChartData]="getData"
      [tooltipPosition]="tooltipPosition"
    ></app-chart-component>
  `,
})
export class TrafficChartComponent {
  @Input() tooltipPosition: "left" | "right" | "top" = "right"

  getData: () => Observable<ChartResponse>

  constructor(private _dashboardService: DashboardService) {
    this.getData = _dashboardService.getTrafficChartData
  }
}
