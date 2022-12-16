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
      (chartInitialized)="echartLoaded($event)"
    ></app-chart-component>
  `,
})
export class TrashChartComponent {
  @Input() tooltipPosition: "left" | "right" = "right"

  getData: () => Observable<ChartResponse>
  echartsInstance!: EChartsType

  constructor(
    private _dashboardService: DashboardService,
    private router: Router
  ) {
    this.getData = _dashboardService.getTrashChartData
  }

  echartLoaded(ec: EChartsType) {
    this.echartsInstance = ec
    this.echartsInstance.on("click", (params) => {
      console.log(params)
      this.router.navigate(
        [
          "",
          {
            outlets: {
              dialog: ["chart-image"],
            },
          },
        ],
        {
          queryParams: {
            type: "trash",
          },
        }
      )
    })
  }
}
