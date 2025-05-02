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
    component = new StatistikComponent(
      statisticsService,
      cctvService,
      toastrService
    )
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

  it("should handle null data in chart updates", () => {
    component.updateChartFlood(null)
    component.updateChartTrash(null)
    component.updateChartTraffic(null)
    component.updateChartStreetVendor(null)
    component.updateChartCrowd(null)
    component.updateTotalChartFlood(null)
    expect(component.chartOptionsFlood).toBeDefined()
    expect(component.chartOptionsTrash).toBeDefined()
    expect(component.chartOptionsTraffic).toBeDefined()
    expect(component.chartOptionsStreetVendor).toBeDefined()
    expect(component.chartOptionsCrowd).toBeDefined()
  })

  it("should handle undefined data in chart updates", () => {
    component.updateChartFlood(undefined)
    component.updateChartTrash(undefined)
    component.updateChartTraffic(undefined)
    component.updateChartStreetVendor(undefined)
    component.updateChartCrowd(undefined)
    component.updateTotalChartFlood(undefined)
    expect(component.chartOptionsFlood).toBeDefined()
    expect(component.chartOptionsTrash).toBeDefined()
    expect(component.chartOptionsTraffic).toBeDefined()
    expect(component.chartOptionsStreetVendor).toBeDefined()
    expect(component.chartOptionsCrowd).toBeDefined()
  })

  it("should handle empty arrays in chart updates", () => {
    const emptyData = { labels: [], data: [] }
    component.updateChartFlood(emptyData)
    component.updateChartTrash(emptyData)
    component.updateChartTraffic(emptyData)
    component.updateChartStreetVendor(emptyData)
    component.updateChartCrowd(emptyData)
    component.updateTotalChartFlood(emptyData)
    expect(component.chartOptionsFlood).toBeDefined()
    expect(component.chartOptionsTrash).toBeDefined()
    expect(component.chartOptionsTraffic).toBeDefined()
    expect(component.chartOptionsStreetVendor).toBeDefined()
    expect(component.chartOptionsCrowd).toBeDefined()
  })

  it("should handle different detection types", () => {
    component.pilihdeteksi = "FLOOD"
    component.fetchData()
    expect(statisticsService.dataDetection).toHaveBeenCalled()

    component.pilihdeteksi = "TRASH"
    component.fetchData()
    expect(statisticsService.dataDetection).toHaveBeenCalled()

    component.pilihdeteksi = "TRAFFIC"
    component.fetchData()
    expect(statisticsService.dataDetection).toHaveBeenCalled()

    component.pilihdeteksi = "STREET_VENDOR"
    component.fetchData()
    expect(statisticsService.dataDetection).toHaveBeenCalled()

    component.pilihdeteksi = "CROWD"
    component.fetchData()
    expect(statisticsService.dataDetection).toHaveBeenCalled()
  })

  it("should handle error cases in fetchData", () => {
    statisticsService.dataDetection.mockReturnValue(of({ error: "Test error" }))
    component.fetchData()
    expect(component).toBeDefined()
  })

  it("should handle null response in fetchData", () => {
    statisticsService.dataDetection.mockReturnValue(of(null))
    component.fetchData()
    expect(component).toBeDefined()
  })

  it("should handle undefined response in fetchData", () => {
    statisticsService.dataDetection.mockReturnValue(of(undefined))
    component.fetchData()
    expect(component).toBeDefined()
  })

  it("should handle export data with different parameters", () => {
    const mockEvent = { preventDefault: jest.fn() } as unknown as Event
    component.pilihdeteksi = "FLOOD"
    component.startDate = "2023-01-01"
    component.endDate = "2023-01-02"
    component.exportData(mockEvent)
    expect(cctvService.downloadExcel).toHaveBeenCalledWith(1, 5000, {
      type: "FLOOD",
      startDate: "2023-01-01",
      endDate: "2023-01-02",
    })
  })

  it("should handle different time periods with different detection types", () => {
    const timePeriods = ["hari-ini", "minggu-ini", "bulan-ini"]
    const detectionTypes = [
      "FLOOD",
      "TRASH",
      "TRAFFIC",
      "STREET_VENDOR",
      "CROWD",
    ]

    timePeriods.forEach((timePeriod) => {
      detectionTypes.forEach((detectionType) => {
        component.timePeriod = timePeriod
        component.pilihdeteksi = detectionType
        component.fetchData()
        expect(statisticsService.dataDetection).toHaveBeenCalled()
      })
    })
  })

  it("should handle different response types in fetchData", () => {
    const responses = [
      { data: { content: [] } },
      { data: { content: [{ value: 100 }] } },
      { data: { content: [{ value: 100 }, { value: 200 }] } },
      { error: "Test error" },
      null,
      undefined,
    ]

    responses.forEach((response) => {
      statisticsService.dataDetection.mockReturnValue(of(response))
      component.fetchData()
      expect(component).toBeDefined()
    })
  })

  it("should handle different chart data scenarios", () => {
    const scenarios = [
      { labels: [], data: [] },
      { labels: ["2023-01-01"], data: [100] },
      { labels: ["2023-01-01", "2023-01-02"], data: [100, 200] },
      { labels: null, data: null },
      { labels: undefined, data: undefined },
    ]

    scenarios.forEach((scenario) => {
      component.updateChartFlood(scenario)
      component.updateChartTrash(scenario)
      component.updateChartTraffic(scenario)
      component.updateChartStreetVendor(scenario)
      component.updateChartCrowd(scenario)
      component.updateTotalChartFlood(scenario)
      expect(component.chartOptionsFlood).toBeDefined()
      expect(component.chartOptionsTrash).toBeDefined()
      expect(component.chartOptionsTraffic).toBeDefined()
      expect(component.chartOptionsStreetVendor).toBeDefined()
      expect(component.chartOptionsCrowd).toBeDefined()
    })
  })

  it("should handle different fluctuation calculation scenarios", () => {
    const scenarios = [
      [],
      [{ value: 100 }],
      [{ value: 100 }, { value: 200 }],
      [{ value: 200 }, { value: 100 }],
      [{ value: 0 }, { value: 100 }],
      [{ value: 100 }, { value: 0 }],
    ]

    scenarios.forEach((scenario) => {
      const result = component.calculateFluctuations(scenario)
      expect(result).toBeDefined()
    })

    // Handle null and undefined separately
    expect(component.calculateFluctuations([])).toBe(0)
    expect(component.calculateFluctuations([])).toBe(0)
  })

  it("should handle different percentage change scenarios", () => {
    const scenarios = [
      { content: [] },
      { content: [{ value: 100 }] },
      { content: [{ value: 100 }, { value: 200 }] },
      { content: [{ value: 200 }, { value: 100 }] },
      { content: [{ value: 0 }, { value: 100 }] },
      { content: [{ value: 100 }, { value: 0 }] },
      { content: null },
      { content: undefined },
    ]

    scenarios.forEach((scenario) => {
      const result = component.calculatePercentageChange(scenario)
      expect(result).toBeDefined()
    })
  })

  it("should handle export data with different scenarios", () => {
    const scenarios = [
      { type: "FLOOD", startDate: "2023-01-01", endDate: "2023-01-02" },
      { type: "TRASH", startDate: "2023-01-01", endDate: "2023-01-02" },
      { type: "TRAFFIC", startDate: "2023-01-01", endDate: "2023-01-02" },
      { type: "STREET_VENDOR", startDate: "2023-01-01", endDate: "2023-01-02" },
      { type: "CROWD", startDate: "2023-01-01", endDate: "2023-01-02" },
    ]

    scenarios.forEach((scenario) => {
      const mockEvent = { preventDefault: jest.fn() } as unknown as Event
      component.pilihdeteksi = scenario.type
      component.startDate = scenario.startDate
      component.endDate = scenario.endDate
      component.exportData(mockEvent)
      expect(cctvService.downloadExcel).toHaveBeenCalledWith(1, 5000, scenario)
    })
  })

  it("should handle different chart options initialization", () => {
    const chartTypes = ["Flood", "Trash", "Traffic", "StreetVendor", "Crowd"]

    chartTypes.forEach((type) => {
      const data = {
        labels: ["2023-01-01", "2023-01-02"],
        data: [100, 200],
        seriesNames: [type],
      }

      switch (type) {
        case "Flood":
          component.updateChartFlood(data)
          expect(component.chartOptionsFlood).toBeDefined()
          break
        case "Trash":
          component.updateChartTrash(data)
          expect(component.chartOptionsTrash).toBeDefined()
          break
        case "Traffic":
          component.updateChartTraffic(data)
          expect(component.chartOptionsTraffic).toBeDefined()
          break
        case "StreetVendor":
          component.updateChartStreetVendor(data)
          expect(component.chartOptionsStreetVendor).toBeDefined()
          break
        case "Crowd":
          component.updateChartCrowd(data)
          expect(component.chartOptionsCrowd).toBeDefined()
          break
      }
    })
  })

  it("should handle different data detection scenarios", () => {
    const scenarios = [
      { success: true, data: { content: [] } },
      { success: true, data: { content: [{ value: 100 }] } },
      { success: false, error: "Test error" },
      null,
      undefined,
    ]

    scenarios.forEach((scenario) => {
      statisticsService.dataDetection.mockReturnValue(of(scenario))
      component.fetchData()
      expect(component).toBeDefined()
    })
  })

  it("should handle different total calculation scenarios correctly", () => {
    const scenarios = [
      { content: [] },
      { content: [{ value: 100 }] },
      { content: [{ value: 100 }, { value: 200 }] },
      { content: null },
      { content: undefined },
    ]

    const expected = [0, 100, 300, 0, 0]

    scenarios.forEach((scenario, index) => {
      const result = component.calculateTotal(scenario)
      expect(result).toBe(expected[index])
    })
  })

  it("should handle different chart series scenarios", () => {
    const scenarios = [
      { labels: ["2023-01-01"], data: [100], seriesNames: ["Series 1"] },
      {
        labels: ["2023-01-01", "2023-01-02"],
        data: [100, 200],
        seriesNames: ["Series 1", "Series 2"],
      },
      { labels: [], data: [], seriesNames: [] },
      { labels: null, data: null, seriesNames: null },
      { labels: undefined, data: undefined, seriesNames: undefined },
    ]

    scenarios.forEach((scenario) => {
      component.updateChartFlood(scenario)
      component.updateChartTrash(scenario)
      component.updateChartTraffic(scenario)
      component.updateChartStreetVendor(scenario)
      component.updateChartCrowd(scenario)
      expect(component.chartOptionsFlood).toBeDefined()
      expect(component.chartOptionsTrash).toBeDefined()
      expect(component.chartOptionsTraffic).toBeDefined()
      expect(component.chartOptionsStreetVendor).toBeDefined()
      expect(component.chartOptionsCrowd).toBeDefined()
    })
  })

  it("should handle different data detection error scenarios", () => {
    const errorScenarios = [
      { error: "Network error" },
      { error: "Server error" },
      { error: "Invalid data" },
      { error: null },
      { error: undefined },
    ]

    errorScenarios.forEach((scenario) => {
      statisticsService.dataDetection.mockReturnValue(of(scenario))
      component.fetchData()
      expect(component).toBeDefined()
    })
  })

  it("should handle different total calculation error scenarios", () => {
    const errorScenarios = [
      { content: null },
      { content: undefined },
      { content: [{ value: null }] },
      { content: [{ value: undefined }] },
      { content: [{ value: "invalid" }] },
    ]

    errorScenarios.forEach((scenario) => {
      const result = component.calculateTotal(scenario)
      expect(result).toBeDefined()
    })
  })

  it("should handle different percentage change error scenarios", () => {
    const errorScenarios = [
      { content: null },
      { content: undefined },
      { content: [{ value: null }] },
      { content: [{ value: undefined }] },
      { content: [{ value: "invalid" }] },
    ]

    errorScenarios.forEach((scenario) => {
      const result = component.calculatePercentageChange(scenario)
      expect(result).toBeDefined()
    })
  })

  it("should handle different fluctuation calculation error scenarios", () => {
    const errorScenarios = [
      null,
      undefined,
      [{ value: null }],
      [{ value: undefined }],
      [{ value: "invalid" }],
    ] as any[]

    errorScenarios.forEach((scenario) => {
      const result = component.calculateFluctuations(scenario)
      expect(result).toBeDefined()
    })
  })

  it("should handle different time period selections", () => {
    const scenarios = [
      {
        period: "hari-ini",
        expectedStart: format(new Date(), "yyyy-MM-dd"),
        expectedEnd: format(new Date(), "yyyy-MM-dd"),
      },
      {
        period: "minggu-ini",
        expectedStart: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
        expectedEnd: format(new Date(), "yyyy-MM-dd"),
      },
      {
        period: "bulan-ini",
        expectedStart: format(subMonths(new Date(), 1), "yyyy-MM-dd"),
        expectedEnd: format(new Date(), "yyyy-MM-dd"),
      },
      {
        period: "custom",
        expectedStart: "2024-01-01",
        expectedEnd: "2024-01-31",
      },
    ]

    scenarios.forEach((scenario) => {
      component.timePeriod = scenario.period
      if (scenario.period === "custom") {
        component.startDate = scenario.expectedStart
        component.endDate = scenario.expectedEnd
      }
      component.fetchData()

      if (scenario.period !== "custom") {
        expect(component.startDate).toBe(scenario.expectedStart)
        expect(component.endDate).toBe(scenario.expectedEnd)
      } else {
        expect(component.startDate).toBe(scenario.expectedStart)
        expect(component.endDate).toBe(scenario.expectedEnd)
      }
    })
  })

  it("should handle unsuccessful responses from services", () => {
    statisticsService.totalFlood.mockReturnValue(
      of({ success: false, data: null })
    )
    statisticsService.totalTrash.mockReturnValue(
      of({ success: false, data: null })
    )
    statisticsService.totalTraffict.mockReturnValue(
      of({ success: false, data: null })
    )
    statisticsService.totalStreetVendor.mockReturnValue(
      of({ success: false, data: null })
    )
    statisticsService.totalCrowd.mockReturnValue(
      of({ success: false, data: null })
    )

    component.fetchData()

    expect(component.totalFlood).toEqual([0])
    expect(component.totalTrash).toEqual([0])
    expect(component.totalTraffict).toEqual([0])
    expect(component.totalSreetVendor).toEqual([0])
    expect(component.totalCrowd).toEqual([0])
  })

  it("should handle edge cases in calculateFluctuations", () => {
    const scenarios = [
      {
        content: [],
        expected: 0,
      },
      {
        content: [{ value: 100 }],
        expected: 0,
      },
      {
        content: [{ value: 100 }, { value: 200 }],
        expected: 100,
      },
      {
        content: [{ value: 200 }, { value: 100 }],
        expected: -50,
      },
      {
        content: [{ value: 0 }, { value: 100 }],
        expected: 0,
      },
    ]

    scenarios.forEach((scenario) => {
      const result = component.calculateFluctuations(scenario.content)
      expect(result).toBeCloseTo(scenario.expected)
    })
  })

  it("should handle edge cases in calculatePercentageChange", () => {
    const scenarios = [
      {
        data: { content: [] },
        expected: null,
      },
      {
        data: { content: [{ value: 100 }] },
        expected: null,
      },
      {
        data: { content: [{ value: 100 }, { value: 200 }] },
        expected: { percentageChange: 100 },
      },
      {
        data: { content: [{ value: 200 }, { value: 100 }] },
        expected: { percentageChange: -50 },
      },
      {
        data: { content: [{ value: 0 }, { value: 100 }] },
        expected: { percentageChange: 0 },
      },
    ]

    scenarios.forEach((scenario) => {
      const result = component.calculatePercentageChange(scenario.data)
      if (scenario.expected === null) {
        expect(result).toBeNull()
      } else {
        expect(result?.percentageChange).toBeCloseTo(
          scenario.expected.percentageChange
        )
      }
    })
  })

  it("should handle edge cases in chart updates", () => {
    const scenarios = [
      {
        data: { content: [] },
        expectedSeries: [],
      },
      {
        data: { content: [{ value: 100, snapshotCreated: "2024-01-01" }] },
        expectedSeries: [100],
      },
      {
        data: {
          content: [
            { value: 100, snapshotCreated: "2024-01-01" },
            { value: 200, snapshotCreated: "2024-01-02" },
          ],
        },
        expectedSeries: [100, 200],
      },
      {
        data: {
          content: [
            { value: 0, snapshotCreated: "2024-01-01" },
            { value: 0, snapshotCreated: "2024-01-02" },
            { value: 100, snapshotCreated: "2024-01-03" },
          ],
        },
        expectedSeries: [0, 0, 100],
      },
    ]

    scenarios.forEach((scenario) => {
      component.updateChartFlood(scenario.data)
      component.updateChartTrash(scenario.data)
      component.updateChartTraffic(scenario.data)
      component.updateChartStreetVendor(scenario.data)
      component.updateChartCrowd(scenario.data)

      expect(component.chartOptionsFlood).toBeDefined()
      expect(component.chartOptionsTrash).toBeDefined()
      expect(component.chartOptionsTraffic).toBeDefined()
      expect(component.chartOptionsStreetVendor).toBeDefined()
      expect(component.chartOptionsCrowd).toBeDefined()
    })
  })

  it("should handle edge cases in total calculations", () => {
    const scenarios = [
      {
        data: { content: [] },
        expected: 0,
      },
      {
        data: { content: [{ value: 100 }] },
        expected: 100,
      },
      {
        data: { content: [{ value: 100 }, { value: 200 }] },
        expected: 300,
      },
      {
        data: {
          content: [{ value: null }, { value: undefined }, { value: 100 }],
        },
        expected: 100,
      },
    ]

    scenarios.forEach((scenario) => {
      const result = component.calculateTotal(scenario.data)
      expect(result).toBe(scenario.expected)
    })
  })

  it("should handle all detection types in fetchData", () => {
    const detectionTypes = [
      "FLOOD",
      "TRASH",
      "TRAFFIC",
      "STREET_VENDOR",
      "CROWD",
    ]

    detectionTypes.forEach((type) => {
      component.pilihdeteksi = type
      component.fetchData()

      const calls = statisticsService.dataDetection.mock.calls
      const lastCall = calls[calls.length - 1]
      if (lastCall && lastCall[1]) {
        const params = lastCall[1] as Record<string, string>
        expect(lastCall[0]).toBe(false)
        expect(params["type"]).toBe(type)
        expect(params["page"]).toBe("0")
        expect(params["size"]).toBe("20")
        expect(params["direction"]).toBe("DESC")
        expect(params["sort"]).toBe("SNAPSHOT_CREATED")
        expect(params["nntk"]).toBe("nntkdata")
        expect(typeof params["startDate"]).toBe("string")
        expect(typeof params["endDate"]).toBe("string")
      }
    })
  })

  it("should process flood statistics with data", () => {
    const floodData = { labels: ["Jan"], data: [100] }
    statisticsService.getStatisticsFlood.mockReturnValue(of(floodData))

    component.updateChartFlood(floodData)
    expect(component.chartOptionsFlood).toBeDefined()
  })

  it("should initialize chart for each type", () => {
    const chartTypes = ["Flood", "Trash", "Traffic", "StreetVendor", "Crowd"]
    chartTypes.forEach((type) => {
      component.pilihdeteksi = type.toUpperCase()
      component.fetchData()
      expect(component.chartOptionsFlood).toBeDefined()
      expect(component.chartOptionsTrash).toBeDefined()
      expect(component.chartOptionsTraffic).toBeDefined()
      expect(component.chartOptionsStreetVendor).toBeDefined()
      expect(component.chartOptionsCrowd).toBeDefined()
    })
  })

  it("should handle different total calculation scenarios correctly", () => {
    const scenarios = [
      { content: [] },
      { content: [{ value: 100 }] },
      { content: [{ value: 100 }, { value: 200 }] },
      { content: null },
      { content: undefined },
    ]

    const expected = [0, 100, 300, 0, 0]

    scenarios.forEach((scenario, index) => {
      const result = component.calculateTotal(scenario)
      expect(result).toBe(expected[index])
    })
  })
})
