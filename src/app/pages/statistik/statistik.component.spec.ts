import { ComponentFixture, TestBed } from "@angular/core/testing"
import { StatistikComponent } from "./statistik.component"
import { StatisticsService } from "./statistik.service"
import { CCTVListService } from "../dialog/cctvlist/cctvlist.service"
import { ToastrService } from "ngx-toastr"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { HttpClientModule } from "@angular/common/http"
import { of } from "rxjs"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { NgxEchartsModule } from "ngx-echarts"
import { format, subWeeks, subMonths } from "date-fns"

describe("StatistikComponent", () => {
  let component: StatistikComponent
  let fixture: ComponentFixture<StatistikComponent>
  let statisticsService: jest.Mocked<StatisticsService>
  let cctvService: jest.Mocked<CCTVListService>
  let toastrService: jest.Mocked<ToastrService>

  beforeEach(async () => {
    const statisticsMock = {
      dataDetection: jest.fn(),
      totalFlood: jest.fn(),
      totalTrash: jest.fn(),
      totalTraffict: jest.fn(),
      totalStreetVendor: jest.fn(),
      totalCrowd: jest.fn(),
      getStatisticsFlood: jest.fn(),
      getStatisticsTrash: jest.fn(),
      getStatisticsTraffic: jest.fn(),
      getStatisticsStreetVendor: jest.fn(),
      getStatisticsCrowd: jest.fn(),
    } as unknown as jest.Mocked<StatisticsService>

    const cctvMock = {
      downloadExcel: jest.fn(),
    } as unknown as jest.Mocked<CCTVListService>
    const toastrMock = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
    } as unknown as jest.Mocked<ToastrService>

    await TestBed.configureTestingModule({
      imports: [
        StatistikComponent,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule,
        NgxEchartsModule.forRoot({
          echarts: () => import("echarts"),
        }),
      ],
      providers: [
        { provide: StatisticsService, useValue: statisticsMock },
        { provide: CCTVListService, useValue: cctvMock },
        { provide: ToastrService, useValue: toastrMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
      ],
    }).compileComponents()

    statisticsService = TestBed.inject(
      StatisticsService
    ) as jest.Mocked<StatisticsService>
    cctvService = TestBed.inject(
      CCTVListService
    ) as jest.Mocked<CCTVListService>
    toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>

    // Setup mock responses
    statisticsService.dataDetection.mockReturnValue(
      of({ data: { content: [] } })
    )
    statisticsService.totalFlood.mockReturnValue(
      of({ success: true, data: { content: [] } })
    )
    statisticsService.totalTrash.mockReturnValue(
      of({ success: true, data: { content: [] } })
    )
    statisticsService.totalTraffict.mockReturnValue(
      of({ success: true, data: { content: [] } })
    )
    statisticsService.totalStreetVendor.mockReturnValue(
      of({ success: true, data: { content: [] } })
    )
    statisticsService.totalCrowd.mockReturnValue(
      of({ success: true, data: { content: [] } })
    )
    statisticsService.getStatisticsFlood.mockReturnValue(
      of({ labels: [], data: [] })
    )
    statisticsService.getStatisticsTrash.mockReturnValue(
      of({ labels: [], data: [] })
    )
    statisticsService.getStatisticsTraffic.mockReturnValue(
      of({ labels: [], data: [] })
    )
    statisticsService.getStatisticsStreetVendor.mockReturnValue(
      of({ labels: [], data: [] })
    )
    statisticsService.getStatisticsCrowd.mockReturnValue(
      of({ labels: [], data: [] })
    )

    fixture = TestBed.createComponent(StatistikComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should fetch data with hari-ini time period", () => {
    component.timePeriod = "hari-ini"
    component.fetchData()
    expect(component.startDate).toBe(format(new Date(), "yyyy-MM-dd"))
    expect(component.endDate).toBe(format(new Date(), "yyyy-MM-dd"))
  })

  it("should fetch data with minggu-ini time period", () => {
    component.timePeriod = "minggu-ini"
    component.fetchData()
    expect(component.startDate).toBe(
      format(subWeeks(new Date(), 1), "yyyy-MM-dd")
    )
    expect(component.endDate).toBe(format(new Date(), "yyyy-MM-dd"))
  })

  it("should fetch data with bulan-ini time period", () => {
    component.timePeriod = "bulan-ini"
    component.fetchData()
    expect(component.startDate).toBe(
      format(subMonths(new Date(), 1), "yyyy-MM-dd")
    )
    expect(component.endDate).toBe(format(new Date(), "yyyy-MM-dd"))
  })

  it("should calculate percentage change correctly", () => {
    const mockData = {
      content: [
        { snapshotCreated: "2023-01-01T00:00:00", value: 100 },
        { snapshotCreated: "2023-01-02T00:00:00", value: 150 },
        { snapshotCreated: "2023-01-03T00:00:00", value: 200 },
      ],
    }
    const result = component.calculatePercentageChange(mockData)
    expect(result).toBeDefined()
    expect(result?.percentageChange).toBeDefined()
  })

  it("should handle empty data in calculatePercentageChange", () => {
    const mockData = {
      content: [],
    }
    const result = component.calculatePercentageChange(mockData)
    expect(result).toBeNull()
  })

  it("should update chart data for flood", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [100, 150],
    }
    component.updateChartFlood(mockData)
    expect(component.chartOptionsFlood).toBeDefined()
  })

  it("should update chart data for trash", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [50, 75],
    }
    component.updateChartTrash(mockData)
    expect(component.chartOptionsTrash).toBeDefined()
  })

  it("should update chart data for traffic", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [200, 250],
    }
    component.updateChartTraffic(mockData)
    expect(component.chartOptionsTraffic).toBeDefined()
  })

  it("should update chart data for street vendor", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [10, 15],
    }
    component.updateChartStreetVendor(mockData)
    expect(component.chartOptionsStreetVendor).toBeDefined()
  })

  it("should update chart data for crowd", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [300, 350],
    }
    component.updateChartCrowd(mockData)
    expect(component.chartOptionsCrowd).toBeDefined()
  })

  it("should handle export data", () => {
    const mockEvent = { preventDefault: jest.fn() } as unknown as Event
    component.exportData(mockEvent)
    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(cctvService.downloadExcel).toHaveBeenCalled()
  })

  it("should calculate fluctuations correctly", () => {
    const mockContent = [
      { snapshotCreated: "2023-01-01T00:00:00", value: 100 },
      { snapshotCreated: "2023-01-02T00:00:00", value: 150 },
      { snapshotCreated: "2023-01-03T00:00:00", value: 200 },
    ]
    const result = component.calculateFluctuations(mockContent)
    expect(result).toBeDefined()
    expect(result).toBeGreaterThan(0)
  })

  it("should handle empty content in calculateFluctuations", () => {
    const result = component.calculateFluctuations([])
    expect(result).toBe(0)
  })

  it("should update total chart flood data", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [100, 150],
    }
    component.updateTotalChartFlood(mockData)
    expect(component.totalFlood).toBeDefined()
    expect(component.totalFlood.length).toBeGreaterThan(0)
  })

  it("should show alert", () => {
    const spy = jest.spyOn(toastrService, "info")
    component.showAlert()
    expect(spy).toHaveBeenCalled()
  })

  it("should initialize component with default values", () => {
    component = new StatistikComponent(statisticsService, cctvService)
    expect(component.startDate).toBe("")
    expect(component.endDate).toBe("")
    expect(component.timePeriod).toBe("")
    expect(component.pilihdeteksi).toBe("FLOOD")
  })

  it("should handle error cases in fetchData", () => {
    statisticsService.dataDetection.mockReturnValue(
      of({ error: "Error occurred" })
    )
    statisticsService.totalFlood.mockReturnValue(of({ success: false }))

    component.fetchData()
    expect(component.detections).toEqual([])
  })

  it("should handle chart options initialization", () => {
    expect(component.chartOptionsFlood).toBeDefined()
    expect(component.chartOptionsTrash).toBeDefined()
    expect(component.chartOptionsTraffic).toBeDefined()
    expect(component.chartOptionsStreetVendor).toBeDefined()
    expect(component.chartOptionsCrowd).toBeDefined()
  })

  it("should handle empty data in chart updates", () => {
    const emptyData = { labels: [], data: [] }
    component.updateChartFlood(emptyData)
    component.updateChartTrash(emptyData)
    component.updateChartTraffic(emptyData)
    component.updateChartStreetVendor(emptyData)
    component.updateChartCrowd(emptyData)

    expect(component.chartOptionsFlood).toBeDefined()
    expect(component.chartOptionsTrash).toBeDefined()
    expect(component.chartOptionsTraffic).toBeDefined()
    expect(component.chartOptionsStreetVendor).toBeDefined()
    expect(component.chartOptionsCrowd).toBeDefined()
  })
})
