import { Component, Input, OnInit } from "@angular/core"
import { Observable } from "rxjs"
import { ChartResponse, DashboardService } from "../../dashboard.service"

@Component({
  selector: "app-street-vendor-chart",
  template: `
    <app-chart-component
      panelTitle="Pedagang Kaki Lima"
      [getChartData]="getData"
      [tooltipPosition]="tooltipPosition"
    ></app-chart-component>
  `,
})
export class StreetVendorChartComponent {
  @Input() tooltipPosition: "left" | "right" = "right"

  getData: () => Observable<ChartResponse>

  constructor(private _dashboardService: DashboardService) {
    this.getData = _dashboardService.getFloodChartData
  }
}
