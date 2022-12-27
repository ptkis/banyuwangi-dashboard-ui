import { Component, Input, NgZone, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { EChartsType } from "echarts"
import { Observable } from "rxjs"
import { ChartResponse, DashboardService } from "../../dashboard.service"

@Component({
  selector: "app-line-chart",
  template: `
    <app-chart-component
      [panelTitle]="chartTitle"
      [getChartData]="getData"
      [tooltipPosition]="tooltipPosition"
      (chartInitialized)="echartLoaded($event)"
      (menuClicked)="menuClick($event)"
      (pointClicked)="pointClick($event)"
    ></app-chart-component>
  `,
})
export class LineChartComponent {
  @Input() chartTitle = "Line Chart"
  @Input() chartType = "trash"
  @Input() tooltipPosition: "left" | "right" | "top" = "right"
  @Input() getData!: () => Observable<ChartResponse>

  echartsInstance!: EChartsType

  constructor(private router: Router, private zone: NgZone) {}

  echartLoaded(ec: EChartsType) {
    this.echartsInstance = ec
  }

  menuClick(type: string) {
    if (type === "image") {
      this.zone.run(() => {
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
              type: this.chartType,
            },
          }
        )
      })
    } else if (type === "data") {
      this.router.navigate(
        [
          "",
          {
            outlets: {
              dialog: ["chart-data"],
            },
          },
        ],
        {
          queryParams: {
            type: this.chartType,
          },
        }
      )
    } else if (type === "download") {
    }
  }

  pointClick(data: Record<string, unknown>) {
    this.zone.run(() => {
      if (data["data"]) {
        this.router.navigate(
          [
            "",
            {
              outlets: {
                dialog: ["toast-chart-image"],
              },
            },
          ],
          {
            queryParams: {
              snapshotid: data["snapshotId"],
              value: data["data"],
              type: this.chartType,
            },
          }
        )
      }
    })
  }
}
