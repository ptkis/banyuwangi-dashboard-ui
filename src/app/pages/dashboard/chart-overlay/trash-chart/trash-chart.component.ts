import { Component, Input, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { EChartsType } from "echarts"
import { Observable } from "rxjs"
import { ChartResponse, DashboardService } from "../../dashboard.service"

@Component({
  selector: "app-trash-chart",
  template: `
    <app-chart-component
      panelTitle="Sampah Jalan Raya"
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
