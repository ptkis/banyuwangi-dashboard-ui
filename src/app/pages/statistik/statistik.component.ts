import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { DashboardModule } from "src/app/pages/dashboard/dashboard.module"
import { NgxEchartsModule } from "ngx-echarts"
import { EChartsOption } from "echarts"
import { StatisticsService } from "./statistik.service"
import { format, isToday, subMonths, subWeeks } from "date-fns"
import { materialModules } from "src/app/shared/shared.module"
import { RouterModule } from "@angular/router"
import { FormsModule, FormGroup, FormControl } from "@angular/forms"
import { ChartDataComponent } from "../dialog/chart-data/chart-data.component"
import { MatSortModule } from "@angular/material/sort" // Tambahkan ini
import { CCTVListService } from "../dialog/cctvlist/cctvlist.service"
import { MatTableModule } from "@angular/material/table"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatCardModule } from "@angular/material/card"
@Component({
  selector: "app-statistik",
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DashboardModule,
    NgxEchartsModule,
    materialModules,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
  ],
  templateUrl: "./statistik.component.html",
  styleUrls: ["./statistik.component.scss"],
})
export class StatistikComponent implements OnInit {
  constructor(
    private statisticsService: StatisticsService,
    private _cctvService: CCTVListService
  ) {}

  startDate: string = ""
  endDate: string = ""
  timePeriod: string = ""
  pilihdeteksi: string = "FLOOD"

  fetchData() {
    // alert('update Api')
    console.log("Tanggal yang dipilih:", this.startDate) // Debugging
    this.startDate = this.startDate
    this.endDate = this.endDate
    this.timePeriod = this.timePeriod
    this.pilihdeteksi = this.pilihdeteksi
    console.log("pilihdeteksi : " + this.pilihdeteksi)

    if (this.timePeriod === "hari-ini") {
      this.startDate = format(new Date(), "yyyy-MM-dd")
      this.endDate = format(new Date(), "yyyy-MM-dd")
    }
    if (this.timePeriod === "minggu-ini") {
      this.startDate = format(subWeeks(new Date(), 1), "yyyy-MM-dd")
      this.endDate = format(new Date(), "yyyy-MM-dd")
    }
    if (this.timePeriod === "bulan-ini") {
      this.startDate = format(subMonths(new Date(), 1), "yyyy-MM-dd")
      this.endDate = format(new Date(), "yyyy-MM-dd")
    }

    this.statisticsService
      .dataDetection(false, {
        type: this.pilihdeteksi,
        startDate: this.startDate,
        endDate: this.endDate,
        page: "0",
        size: "20",
        direction: "DESC",
        sort: "SNAPSHOT_CREATED",
        nntk: "nntkdata",
      })
      .subscribe((response) => {
        this.detections = response.data.content.map((item: any) => ({
          timestamp: item.snapshotCreated,
          cameraName: item.snapshotCameraName,
          cameraLocation: item.snapshotCameraLocation,
          latitude: item.snapshotCameraLatitude,
          longitude: item.snapshotCameraLongitude,
          maxValue: item.maxValue,
          value: item.value,
        }))
      })

    this.statisticsService
      .totalFlood(false, {
        type: "FLOOD",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        if (response.success) {
          this.dataFlood = response.data
          this.totalFlood = [
            response.data.content.reduce(
              (sum: number, item: { value?: number }) =>
                sum + (item.value || 0),
              0
            ),
          ]
          // this.fluktuasiFlood = [this.calculateFluctuations(response.data.content)]
          const result = this.calculatePercentageChange(response.data)
          if (result) {
            this.fluktuasiFlood = [result.percentageChange]
          }
        }
      })

    this.statisticsService
      .totalTrash(false, {
        type: "TRASH",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        if (response.success) {
          this.dataTrash = response.data
          this.totalTrash = [
            response.data.content.reduce(
              (sum: number, item: { value?: number }) =>
                sum + (item.value || 0),
              0
            ),
          ]
          // this.fluktuasiTrash = [this.calculateFluctuations(response.data.content)]
          const result = this.calculatePercentageChange(response.data)
          console.log("nilai fluktuasi sampah" + result)
          if (result) {
            this.fluktuasiTrash = [result.percentageChange]
          }
        }
      })
    this.statisticsService
      .totalTraffict(false, {
        type: "TRAFFIC",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        if (response.success) {
          this.dataTraffict = response.data
          this.totalTraffict = [
            response.data.content.reduce(
              (sum: number, item: { value?: number }) =>
                sum + (item.value || 0),
              0
            ),
          ]
          //this.fluktuasiTraffict = [this.calculateFluctuations(response.data.content)]
          const result = this.calculatePercentageChange(response.data)
          if (result) {
            this.fluktuasiTraffict = [result.percentageChange]
          }
        }
      })
    this.statisticsService
      .totalStreetVendor(false, {
        type: "STREETVENDOR",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        if (response.success) {
          this.dataStreetVendor = response.data
          this.totalSreetVendor = [
            response.data.content.reduce(
              (sum: number, item: { value?: number }) =>
                sum + (item.value || 0),
              0
            ),
          ]
          // this.fluktuasiStreetVendor = [this.calculateFluctuations(response.data.content)]
          const result = this.calculatePercentageChange(response.data)
          if (result) {
            this.fluktuasiStreetVendor = [result.percentageChange]
          }
        }
      })
    this.statisticsService
      .totalCrowd(false, {
        type: "CROWD",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        if (response.success) {
          this.dataCrowd = response.data
          this.totalCrowd = [
            response.data.content.reduce(
              (sum: number, item: { value?: number }) =>
                sum + (item.value || 0),
              0
            ),
          ]
          // this.fluktuasiCrowd = [this.calculateFluctuations(response.data.content)]
          const result = this.calculatePercentageChange(response.data)
          if (result) {
            this.fluktuasiCrowd = [result.percentageChange]
          }
        }
      })

    this.statisticsService
      .getStatisticsFlood(false, {
        type: "FLOOD",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        this.updateChartFlood(response)
      })
    this.statisticsService
      .getStatisticsTrash(false, {
        type: "TRASH",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        this.updateChartTrash(response)
      })
    this.statisticsService
      .getStatisticsTraffic(false, {
        type: "TRAFFIC",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        this.updateChartTraffic(response)
      })
    this.statisticsService
      .getStatisticsStreetVendor(false, {
        type: "STREETVENDOR",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        this.updateChartStreetVendor(response)
      })
    this.statisticsService
      .getStatisticsCrowd(false, {
        type: "CROWD",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        this.updateChartCrowd(response)
      })
  }

  showAlert() {
    alert("Tombol diklik!")
  }

  exportData(e: Event) {
    console.log(
      "Exporting data with:",
      this.startDate,
      this.endDate,
      this.timePeriod
    )
    const data: Record<string, string> = {}
    data["startDate"] = this.startDate
    data["endDate"] = this.endDate
    //data["type"] = 'TRASH'
    this._cctvService.downloadExcel(1, 5000, data)
  }

  cards = [
    {
      title: "Data Genangan Air",
      value: 350,
      change: 4.56,
      icon: "assets/images/genangan_air.png",
    },
    {
      title: "Sampah Jalan & Sungai",
      value: 89,
      change: -2,
      icon: "assets/images/sampah.png",
    },
    {
      title: "Keramaian Orang",
      value: 541,
      change: 4.56,
      icon: "assets/images/keramaian.png",
    },
    {
      title: "Pedagang Kaki Lima",
      value: 32,
      change: 4,
      icon: "assets/images/pedagang_kaki_lima.png",
    },
    {
      title: "Kepadatan Lalu Lintas",
      value: 412,
      change: -0.03,
      icon: "assets/images/lalu_lintas.png",
    },
  ]
  dataFlood: any[0]
  fluktuasiFlood: any[0]
  totalFlood: any[] = [0]
  dataTrash: any[0]
  fluktuasiTrash: any[0]
  totalTrash: any[] = [0]
  dataTraffict: any[0]
  fluktuasiTraffict: any[0]
  totalTraffict: any[] = [0]
  dataStreetVendor: any
  fluktuasiStreetVendor: any[0]
  totalSreetVendor: any[] = [0]
  dataCrowd: any
  fluktuasiCrowd: any[0]
  totalCrowd: any[] = [0]
  detections: any[] = []
  fluctuations: { date: string; percentageChange: string }[] = []
  calculatePercentageChange(data: any) {
    const groupedData: { [date: string]: number } = {}
    // Kelompokkan nilai berdasarkan tanggal
    data.content.forEach((item: any) => {
      const date = item.snapshotCreated.split("T")[0] // Ambil YYYY-MM-DD
      groupedData[date] = (groupedData[date] || 0) + item.value
    })
    // Ambil dua tanggal terbaru
    const sortedDates = Object.keys(groupedData).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    )
    if (sortedDates.length < 2) {
      return null
    }
    const lastDate = sortedDates[sortedDates.length - 1]
    const prevDate = sortedDates[sortedDates.length - 2]
    const lastValue = groupedData[lastDate]
    const prevValue = groupedData[prevDate]
    // Hitung persentase perubahan
    const percentageChange =
      prevValue !== 0 ? ((lastValue - prevValue) / prevValue) * 100 : 0
    return {
      lastDate,
      prevDate,
      lastValue,
      prevValue,
      percentageChange: percentageChange.toFixed(2) + "%",
    }
  }

  calculateFluctuations(content: any[]) {
    const groupedData: { [date: string]: number } = {}
    content.forEach((item) => {
      const date = item.snapshotCreated.split("T")[0] // Ambil tanggal saja
      groupedData[date] = (groupedData[date] || 0) + item.value
    })

    const dates = Object.keys(groupedData).sort()
    for (let i = 1; i < dates.length; i++) {
      const prevDate = dates[i - 1]
      const currentDate = dates[i]
      const prevValue = groupedData[prevDate]
      const currentValue = groupedData[currentDate]
      const change = ((currentValue - prevValue) / prevValue) * 100
      this.fluctuations.push({
        date: currentDate,
        percentageChange: change.toFixed(2),
      })
    }
  }

  ngOnInit(): void {
    this.startDate = format(subMonths(new Date(), 1), "yyyy-MM-dd")
    this.endDate = format(new Date(), "yyyy-MM-dd")
    this.timePeriod = ""

    this.statisticsService
      .dataDetection(false, {
        type: this.pilihdeteksi,
        startDate: this.startDate,
        endDate: this.endDate,
        page: "0",
        size: "20",
        direction: "DESC",
        sort: "SNAPSHOT_CREATED",
        nntk: "nntkdata",
      })
      .subscribe((response) => {
        this.detections = response.data.content.map((item: any) => ({
          timestamp: item.snapshotCreated,
          cameraName: item.snapshotCameraName,
          cameraLocation: item.snapshotCameraLocation,
          latitude: item.snapshotCameraLatitude,
          longitude: item.snapshotCameraLongitude,
          maxValue: item.maxValue,
          value: item.value,
        }))
      })

    this.statisticsService
      .totalFlood(false, {
        type: "FLOOD",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        if (response.success) {
          this.dataFlood = response.data
          this.totalFlood = [
            response.data.content.reduce(
              (sum: number, item: { value?: number }) =>
                sum + (item.value || 0),
              0
            ),
          ]
          // this.fluktuasiFlood = [this.calculateFluctuations(response.data.content)]
          const result = this.calculatePercentageChange(response.data)
          if (result) {
            this.fluktuasiFlood = result.percentageChange
          }
        }
      })
    this.statisticsService
      .totalTrash(false, {
        type: "TRASH",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        if (response.success) {
          this.dataTrash = response.data
          this.totalTrash = [
            response.data.content.reduce(
              (sum: number, item: { value?: number }) =>
                sum + (item.value || 0),
              0
            ),
          ]
          // this.fluktuasiTrash = [this.calculateFluctuations(response.data.content)]
          const result = this.calculatePercentageChange(response.data)
          console.log("nilai fluktuasi sampah" + result)
          if (result) {
            this.fluktuasiTrash = result.percentageChange
          }
        }
      })
    this.statisticsService
      .totalTraffict(false, {
        type: "TRAFFIC",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        if (response.success) {
          this.dataTraffict = response.data
          this.totalTraffict = [
            response.data.content.reduce(
              (sum: number, item: { value?: number }) =>
                sum + (item.value || 0),
              0
            ),
          ]
          //this.fluktuasiTraffict = [this.calculateFluctuations(response.data.content)]
          const result = this.calculatePercentageChange(response.data)
          if (result) {
            this.fluktuasiTraffict = result.percentageChange
          }
        }
      })
    this.statisticsService
      .totalStreetVendor(false, {
        type: "STREETVENDOR",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        if (response.success) {
          this.dataStreetVendor = response.data
          this.totalSreetVendor = [
            response.data.content.reduce(
              (sum: number, item: { value?: number }) =>
                sum + (item.value || 0),
              0
            ),
          ]
          // this.fluktuasiStreetVendor = [this.calculateFluctuations(response.data.content)]
          const result = this.calculatePercentageChange(response.data)
          if (result) {
            this.fluktuasiStreetVendor = result.percentageChange
          }
        }
      })
    this.statisticsService
      .totalCrowd(false, {
        type: "CROWD",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        if (response.success) {
          this.dataCrowd = response.data
          this.totalCrowd = [
            response.data.content.reduce(
              (sum: number, item: { value?: number }) =>
                sum + (item.value || 0),
              0
            ),
          ]
          // this.fluktuasiCrowd = [this.calculateFluctuations(response.data.content)]
          const result = this.calculatePercentageChange(response.data)
          if (result) {
            this.fluktuasiCrowd = result.percentageChange
          }
        }
      })

    this.statisticsService
      .getStatisticsFlood(false, {
        type: "FLOOD",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        this.updateChartFlood(response)
      })
    this.statisticsService
      .getStatisticsTrash(false, {
        type: "TRASH",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        this.updateChartTrash(response)
      })
    this.statisticsService
      .getStatisticsTraffic(false, {
        type: "TRAFFIC",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        this.updateChartTraffic(response)
      })
    this.statisticsService
      .getStatisticsStreetVendor(false, {
        type: "STREETVENDOR",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        this.updateChartStreetVendor(response)
      })
    this.statisticsService
      .getStatisticsCrowd(false, {
        type: "CROWD",
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe((response) => {
        this.updateChartCrowd(response)
      })
  }

  //1.TOTAL FLOOD
  updateTotalChartFlood(data: any): void {
    this.chartOptionsFlood = {
      title: {
        text: "Statistik Data Genangan Air",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: data.labels.map((label: string) => label.substring(11, 16)), // Ambil jam dari timestamp
        axisLabel: {
          rotate: 30,
        },
      },
      yAxis: {
        type: "value",
        name: "Jumlah",
      },
      series: [
        {
          name: data.seriesNames[0],
          type: "line",
          data: data.data[data.seriesNames[0]],
          smooth: true,
          areaStyle: {},
        },
      ],
    }
  }

  //1.FLOOD
  updateChartFlood(data: any): void {
    this.chartOptionsFlood = {
      title: {
        text: "Statistik Data Genangan Air",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: data.labels.map((label: string) => label.substring(11, 16)), // Ambil jam dari timestamp
        axisLabel: {
          rotate: 30,
        },
      },
      yAxis: {
        type: "value",
        name: "Jumlah",
      },
      series: [
        {
          name: data.seriesNames[0],
          type: "line",
          data: data.data[data.seriesNames[0]],
          smooth: true,
          areaStyle: {},
        },
      ],
    }
  }

  chartOptionsFlood: EChartsOption = {
    title: {
      text: "Statistik Genangan Air",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: [
        "06:00",
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
      ],
      axisLabel: {
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      name: "Jumlah ",
    },
    series: [
      {
        name: "Jumlah ",
        type: "line",
        data: [5, 20, 50, 80, 65, 90, 100, 75],
        smooth: true,
        areaStyle: {},
      },
    ],
  }

  //2.TRASH
  updateChartTrash(data: any): void {
    this.chartOptionsTrash = {
      title: {
        text: "Statistik Tumpukan Sampah",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: data.labels.map((label: string) => label.substring(11, 16)), // Ambil jam dari timestamp
        axisLabel: {
          rotate: 30,
        },
      },
      yAxis: {
        type: "value",
        name: "Jumlah",
      },
      series: [
        {
          name: data.seriesNames[0],
          type: "line",
          data: data.data[data.seriesNames[0]],
          smooth: true,
          areaStyle: {},
        },
      ],
    }
  }

  chartOptionsTrash: EChartsOption = {
    title: {
      text: "Statistik Tumpukan Sampah",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: [
        "06:00",
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
      ],
      axisLabel: {
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      name: "Jumlah Orang",
    },
    series: [
      {
        name: "Jumlah Orang",
        type: "line",
        data: [5, 20, 50, 80, 65, 90, 100, 75],
        smooth: true,
        areaStyle: {},
      },
    ],
  }

  //3.Traffic
  updateChartTraffic(data: any): void {
    this.chartOptionsTraffic = {
      title: {
        text: "Statistik Data Lalu Lintas",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: data.labels.map((label: string) => label.substring(11, 16)), // Ambil jam dari timestamp
        axisLabel: {
          rotate: 30,
        },
      },
      yAxis: {
        type: "value",
        name: "Jumlah",
      },
      series: [
        {
          name: data.seriesNames[0],
          type: "line",
          data: data.data[data.seriesNames[0]],
          smooth: true,
          areaStyle: {},
        },
      ],
    }
  }

  chartOptionsTraffic: EChartsOption = {
    title: {
      text: "Statistik Lalu Lintas",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: [
        "06:00",
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
      ],
      axisLabel: {
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      name: "Jumlah Orang",
    },
    series: [
      {
        name: "Jumlah Orang",
        type: "line",
        data: [5, 20, 50, 80, 65, 90, 100, 75],
        smooth: true,
        areaStyle: {},
      },
    ],
  }

  //3.Street Vendor
  updateChartStreetVendor(data: any): void {
    this.chartOptionsStreetVendor = {
      title: {
        text: "Statistik Data Pedagang Kaki Lima",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: data.labels.map((label: string) => label.substring(11, 16)), // Ambil jam dari timestamp
        axisLabel: {
          rotate: 30,
        },
      },
      yAxis: {
        type: "value",
        name: "Jumlah",
      },
      series: [
        {
          name: data.seriesNames[0],
          type: "line",
          data: data.data[data.seriesNames[0]],
          smooth: true,
          areaStyle: {},
        },
      ],
    }
  }

  chartOptionsStreetVendor: EChartsOption = {
    title: {
      text: "Statistik Pedagang Kaki Lima",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: [
        "06:00",
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
      ],
      axisLabel: {
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      name: "Jumlah Orang",
    },
    series: [
      {
        name: "Jumlah Orang",
        type: "line",
        data: [5, 20, 50, 80, 65, 90, 100, 75],
        smooth: true,
        areaStyle: {},
      },
    ],
  }

  //5.KERAMAIAN
  updateChartCrowd(data: any): void {
    this.chartOptionsCrowd = {
      title: {
        text: "Statistik Data Keramaian",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: data.labels.map((label: string) => label.substring(11, 16)), // Ambil jam dari timestamp
        axisLabel: {
          rotate: 30,
        },
      },
      yAxis: {
        type: "value",
        name: "Jumlah",
      },
      series: [
        {
          name: data.seriesNames[0],
          type: "line",
          data: data.data[data.seriesNames[0]],
          smooth: true,
          areaStyle: {},
        },
      ],
    }
  }

  chartOptionsCrowd: EChartsOption = {
    title: {
      text: "Statistik Keramaian Orang",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: [
        "06:00",
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
      ],
      axisLabel: {
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      name: "Jumlah Orang",
    },
    series: [
      {
        name: "Jumlah Orang",
        type: "line",
        data: [5, 20, 50, 80, 65, 90, 100, 75],
        smooth: true,
        areaStyle: {},
      },
    ],
  }
}
