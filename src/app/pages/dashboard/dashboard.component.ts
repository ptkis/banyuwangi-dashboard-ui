import { Component, ViewEncapsulation } from "@angular/core"
import { graphic, EChartsOption } from "echarts"
import { defaultChartConfig } from "src/app/shared/constants/charts"

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {
  chartOption: EChartsOption = {
    ...defaultChartConfig,
    xAxis: {
      ...defaultChartConfig.xAxis,
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    series: [
      {
        name: "Data 1",
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#E7E551",
            },
            {
              offset: 1,
              color: "transparent",
            },
          ]),
        },
      },
      {
        name: "Data 2",
        data: [100, 30, 324, 118, 235, 47, 160],
        type: "line",
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#23639e",
            },
            {
              offset: 1,
              color: "transparent",
            },
          ]),
        },
      },
    ],
  }

  constructor() {}
}
