import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { graphic, EChartsOption, EChartsType } from "echarts"
import {
  ChartData,
  ChartResponse,
  DashboardService,
} from "src/app/pages/dashboard/dashboard.service"
import { defaultChartConfig } from "../../constants/charts"
import { SelectionModel } from "@angular/cdk/collections"
import { DatePipe } from "@angular/common"
import { finalize, Observable } from "rxjs"

@Component({
  selector: "app-chart-component",
  templateUrl: "./chart-component.component.html",
  styleUrls: ["./chart-component.component.scss"],
})
export class ChartComponentComponent {
  @Input() panelTitle = "Chart"
  @Input() tooltipPosition: "left" | "right" | "top" = "right"

  @Input() getChartData!: (...args: any[]) => Observable<ChartResponse>

  @Output() chartInitialized = new EventEmitter<EChartsType>()

  chartOption: EChartsOption = {
    ...defaultChartConfig,
    xAxis: {
      ...defaultChartConfig.xAxis,
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  }

  echartsInstance!: EChartsType

  labels: string[] = []
  data!: ChartData
  allLocations: string[] = []
  selectedLocations = new SelectionModel<string>(true, [])

  errorMessage = ""

  constructor(
    private _dashboardService: DashboardService,
    private datePipe: DatePipe
  ) {}

  setLoading(loading: boolean) {
    if (this.echartsInstance) {
      loading
        ? this.echartsInstance.showLoading()
        : this.echartsInstance.hideLoading()
    }
  }

  setError(err: object) {
    const message = "Failed to load chart data"
    this.errorMessage = message
  }

  onChartInit(ec: EChartsType) {
    this.echartsInstance = ec
    this.chartInitialized.emit(ec)
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

  loadChartData(retry = false) {
    if (this.getChartData) {
      this.setLoading(true)
      this.getChartData
        .bind(this._dashboardService)(retry)
        .pipe(finalize(() => this.setLoading(false)))
        .subscribe({
          next: (resp) => {
            this.labels = resp.labels.map((val) => {
              const tgl = new Date(val)
              return (
                this.datePipe
                  .transform(tgl, "yyyy-MM-dd HH:mm:ss")
                  ?.toString() || ""
              )
            })
            this.data = resp.data
            this.allLocations = Object.keys(this.data)
            this.selectedLocations.select(...this.allLocations)
            this.initCharts()
          },
          error: (err) => this.setError(err),
        })
    }
  }

  generateChartOptions() {
    const series = this.generateSeries(this.data)
    return {
      ...this.chartOption,
      xAxis: {
        ...this.chartOption.xAxis,
        scale: true,
        data: this.labels,
        axisLabel: {
          color: "#fff",
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
        position: (pos: any, params: any, el: any, elRect: any, size: any) => {
          let obj: Record<string, number> = {
            top: -40,
            // left: 230,
          }
          if (this.tooltipPosition === "left") {
            obj["right"] = 230
          }
          if (this.tooltipPosition === "right") {
            obj["left"] = 230
          }
          if (this.tooltipPosition === "top") {
            obj = {
              bottom: 220,
            }
          }
          return obj
        },
        extraCssText: "width: 200px; text-align: left",
      },
    }
  }

  initCharts() {
    this.chartOption = this.generateChartOptions() as any
  }
}
