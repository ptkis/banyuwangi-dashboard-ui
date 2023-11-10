import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core"
import {
  graphic,
  EChartsOption,
  EChartsType,
  DataZoomComponentOption,
} from "echarts"
import {
  ChartData,
  ChartResponse,
  DashboardService,
} from "src/app/pages/dashboard/dashboard.service"
import { SelectionModel } from "@angular/cdk/collections"
import { DatePipe } from "@angular/common"
import { finalize, Observable } from "rxjs"
import { defaultChartConfig } from "src/app/shared/constants/charts"
import { TRANSLOCO_SCOPE } from "@ngneat/transloco"
import { AppService } from "src/app/app.service"
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"
import { format, isToday, subMonths } from "date-fns"

@UntilDestroy()
@Component({
  selector: "app-chart-component",
  templateUrl: "./chart-component.component.html",
  styleUrls: ["./chart-component.component.scss"],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: "dashboard",
    },
  ],
})
export class ChartComponentComponent implements AfterViewInit {
  @Input() panelID = "Chart"
  @Input() panelTitle = "Chart"
  @Input() tooltipPosition: "left" | "right" | "top" = "right"

  @Input() getChartData!: (...args: any[]) => Observable<ChartResponse>
  @Input() chartType = "TRASH"

  @Output() chartInitialized = new EventEmitter<EChartsType>()
  @Output() menuClicked = new EventEmitter<string>()
  @Output() pointClicked = new EventEmitter<{
    dataIndex: number
    seriesName: string
    data: number
    snapshotId: string
  }>()

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
  rawData!: ChartResponse
  allLocations: string[] = []
  selectedLocations = new SelectionModel<string>(true, [])

  errorMessage = ""

  showChartDetail = false
  isLoading = false
  isExpanded = true

  startDate = format(subMonths(new Date(), 1), "yyyy-MM-dd")
  endDate = format(new Date(), "yyyy-MM-dd")

  constructor(
    private _dashboardService: DashboardService,
    private datePipe: DatePipe,
    private appService: AppService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    const expData = sessionStorage.getItem(`${this.panelID}-expanded`)
    if (expData === "false") {
      this.isExpanded = false
    } else {
      this.isExpanded = true
    }
    this.cdr.detectChanges()
  }

  setLoading(loading: boolean) {
    if (this.echartsInstance && !this.echartsInstance.isDisposed()) {
      loading
        ? this.echartsInstance.showLoading()
        : this.echartsInstance.hideLoading()
      this.isLoading = loading
    }
  }

  setError(err: object) {
    const message = "Failed to load chart data"
    this.errorMessage = message
  }

  onChartInit(ec: EChartsType) {
    this.echartsInstance = ec
    this.loadChartData()
    this.echartsInstance.on("click", (params) => {
      const { dataIndex, seriesName, data } = params
      let snapshotId = ""
      if (seriesName && typeof dataIndex !== "undefined") {
        snapshotId = this.rawData?.snapshotIds?.[seriesName]?.[dataIndex]
      }
      this.pointClicked.emit({
        dataIndex,
        seriesName: <string>seriesName,
        data: <number>data,
        snapshotId,
      })
    })

    this.appService.notificationSubject$
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        if (!this.isLoading && !this.showChartDetail) {
          this.loadChartData()
        }
      })
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
    if (!!this.getChartData) {
      this.setLoading(true)

      let req = this.getChartData.bind(this._dashboardService)(retry, {
        startDate: this.startDate,
        endDate: this.endDate,
      })

      if (!this.showChartDetail && this._dashboardService.getTotalChartData) {
        req = this._dashboardService.getTotalChartData(retry, {
          type: this.chartType.toUpperCase(),
          startDate: this.startDate,
          endDate: this.endDate,
        })
      }

      req.pipe(finalize(() => this.setLoading(false))).subscribe({
        next: (resp) => {
          this.labels = resp.labels.map((val) => {
            const tgl = new Date(val)
            return (
              this.datePipe.transform(tgl, "yyyy-MM-dd HH:mm:ss")?.toString() ||
              ""
            )
          })
          this.data = resp.data
          this.rawData = resp
          this.allLocations = Object.keys(this.data)
          this.selectedLocations.select(...this.allLocations)
          this.initCharts()
        },
        error: (err) => this.setError(err),
      })
    }
  }

  chartDetailMenuClick(detail: boolean) {
    this.showChartDetail = detail

    this.loadChartData()
  }

  generateChartOptions() {
    const series = this.generateSeries(this.data)
    let tooltipPos: Record<string, number> = {
      top: -40,
    }
    if (this.tooltipPosition === "left") {
      tooltipPos["right"] = 230
    }
    if (this.tooltipPosition === "right") {
      tooltipPos["left"] = 230
    }
    if (this.tooltipPosition === "top") {
      tooltipPos = {
        bottom: 220,
      }
    }
    const maxData = 20
    const dataLength = series?.[0]?.data.length
    const minDatazoom = 100 - (maxData / dataLength) * 100

    return {
      ...this.chartOption,
      xAxis: {
        ...this.chartOption.xAxis,
        scale: true,
        data: this.labels,
        axisLabel: {
          color: "#fff",
          formatter: (value: string, _idx: number) => {
            const tgl = new Date(value)
            if (this.showChartDetail) {
              return tgl.toLocaleDateString("id-ID")
            }
            return format(tgl, "HH:mm")
          },
        },
      },
      yAxis: {
        ...this.chartOption.yAxis,
        minInterval: 1,
        min: 5,
      },
      series,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        className: "echarts-tooltip",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        position: tooltipPos,
        appendToBody: true,
        order: "valueDesc",
        extraCssText: "width: 200px; text-align: left",
      },
      dataZoom: [
        {
          ...(this.chartOption.dataZoom as DataZoomComponentOption[])[0],
          start: minDatazoom > 0 ? minDatazoom : 0,
        },
        {
          ...(this.chartOption.dataZoom as DataZoomComponentOption[])[1],
          start: minDatazoom > 0 ? minDatazoom : 0,
          show: this.showChartDetail,
        },
      ],
      grid: {
        ...this.chartOption.grid,
        bottom: this.showChartDetail ? "80px" : "50px",
      },
    }
  }

  initCharts() {
    this.chartOption = this.generateChartOptions() as any
    setTimeout(() => {
      this.chartInitialized.emit(this.echartsInstance)
    }, 500)
  }

  menuClick(type: string) {
    this.menuClicked.emit(type)
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded
    sessionStorage.setItem(
      `${this.panelID}-expanded`,
      JSON.stringify(this.isExpanded)
    )
  }
}
