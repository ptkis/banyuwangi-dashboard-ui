import { Component, Input, OnInit } from "@angular/core"
import { graphic, EChartsOption, EChartsType } from "echarts"
import {
  ChartData,
  DashboardService,
} from "src/app/pages/dashboard/dashboard.service"
import { defaultChartConfig } from "../../constants/charts"
import { SelectionModel } from "@angular/cdk/collections"
import { DatePipe } from "@angular/common"

@Component({
  selector: "app-chart-component",
  templateUrl: "./chart-component.component.html",
  styleUrls: ["./chart-component.component.scss"],
})
export class ChartComponentComponent {
  @Input() panelTitle = "Chart"

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

  echartsInstance!: EChartsType

  labels: string[] = []
  data!: ChartData
  allLocations: string[] = []
  selectedLocations = new SelectionModel<string>(true, [])

  constructor(
    private _dashboardService: DashboardService,
    private datePipe: DatePipe
  ) {}

  onChartInit(ec: EChartsType) {
    this.echartsInstance = ec
    this.loadChartData()
  }

  generateSeries(data: typeof this.data) {
    return (
      Object.keys(data)
        // .filter((dt, idx) => idx < 3)
        .map((name) => {
          return {
            name: name,
            data: data[name],
            // stack: 'sampah',
            type: "line",
            showSymbol: false,
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
          }
        })
    )
  }

  locationFilterChanged(items: string[]) {
    // Unselect All
    this.echartsInstance.dispatchAction({
      type: "legendAllSelect",
    })
    this.echartsInstance.dispatchAction({
      type: "legendInverseSelect",
    })

    // Reselect
    for (const item of items) {
      this.echartsInstance.dispatchAction({
        type: "legendSelect",
        // legend name
        name: item,
      })
    }
    this.selectedLocations.clear()
    this.selectedLocations.select(...items)
  }

  loadChartData() {
    if (this.echartsInstance) {
      this.echartsInstance.showLoading()
    }
    this._dashboardService.getTrashChartData().subscribe((resp) => {
      this.labels = resp.labels.map((val) => {
        const tgl = new Date(val)
        return (
          this.datePipe.transform(tgl, "yyyy-MM-dd HH:mm:ss")?.toString() || ""
        )
      })
      this.data = resp.data
      this.allLocations = Object.keys(this.data)
      this.selectedLocations.select(...this.allLocations)
      const series = this.generateSeries(this.data)

      const chartData = {
        ...this.chartOption,
        xAxis: {
          ...this.chartOption.xAxis,
          scale: true,
          data: this.labels,
          axisLabel: {
            formatter: function (value: string, _idx: number) {
              const tgl = new Date(value)
              return tgl.toLocaleDateString("id-ID")
            },
          },
        },
        series,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          // formatter: (componentType: 'series',
          // seriesType: string,
          // seriesIndex: number,
          // seriesName: string,
          // name: string,
          // dataIndex: number,
          // data: Object) => {
          //   return data
          // },
          // valueFormatter: (value: any) => '$' + value,
          position: function (
            pos: any,
            params: any,
            el: any,
            elRect: any,
            size: any
          ) {
            const obj: Record<string, number> = {
              top: -40,
              left: 230,
            }
            // obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
            return obj
          },
          extraCssText: "width: 200px; text-align: left",
        },
      }

      this.chartOption = chartData as any

      if (this.echartsInstance) {
        this.echartsInstance.hideLoading()
      }
    })
  }
}
