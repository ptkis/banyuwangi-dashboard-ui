import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core"
import { graphic, EChartsOption, EChartsType } from "echarts"
import { defaultChartConfig } from "src/app/shared/constants/charts"
import { DashboardService } from "../dashboard.service"
import { CrowdChartComponent } from "./crowd-chart/crowd-chart.component"
import { FloodChartComponent } from "./flood-chart/flood-chart.component"
import { StreetVendorChartComponent } from "./street-vendor-chart/street-vendor-chart.component"
import { TrafficChartComponent } from "./traffic-chart/traffic-chart.component"
import { TrashChartComponent } from "./trash-chart/trash-chart.component"

@Component({
  selector: "app-chart-overlay",
  templateUrl: "./chart-overlay.component.html",
  styleUrls: ["./chart-overlay.component.scss"],
})
export class ChartOverlayComponent implements AfterViewInit {
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

  @ViewChild(CrowdChartComponent) CrowdChart!: CrowdChartComponent
  @ViewChild(FloodChartComponent) FloodChart!: FloodChartComponent
  @ViewChild(StreetVendorChartComponent)
  StreetVendorChart!: StreetVendorChartComponent
  @ViewChild(TrafficChartComponent) TrafficChart!: TrafficChartComponent
  @ViewChild(TrashChartComponent) TrashChart!: TrashChartComponent

  constructor(private _dashboardService: DashboardService) {}

  ngAfterViewInit(): void {
    undefined
  }
}
