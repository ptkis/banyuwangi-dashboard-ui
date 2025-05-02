import { ComponentFixture, TestBed } from "@angular/core/testing"
import { StatistikComponent } from "./statistik.component"
import { StatisticsService } from "./statistik.service"
import { CCTVListService } from "../dialog/cctvlist/cctvlist.service"
import { ToastrService } from "ngx-toastr"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { HttpClientModule } from "@angular/common/http"
import { of, throwError, firstValueFrom, Subscription } from "rxjs"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { NgxEchartsModule } from "ngx-echarts"
import { format, subWeeks, subMonths } from "date-fns"
import * as echarts from "echarts"

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
      getStatisticsCrowd: jest.fn()
    } as unknown as jest.Mocked<StatisticsService>

    const cctvMock = {
      downloadExcel: jest.fn()
    } as unknown as jest.Mocked<CCTVListService>

    const toastrMock = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn()
    } as unknown as jest.Mocked<ToastrService>

    await TestBed.configureTestingModule({
      imports: [
        StatistikComponent,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule,
        NgxEchartsModule.forRoot({
          echarts: () => import("echarts")
        })
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
                get: () => null
              }
            }
          }
        }
      ]
    }).compileComponents()

    statisticsService = TestBed.inject(
      StatisticsService
    ) as jest.Mocked<StatisticsService>
    cctvService = TestBed.inject(CCTVListService) as jest.Mocked<CCTVListService>
    toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>

    // Setup mock responses
    statisticsService.dataDetection.mockReturnValue(
      of({ data: { content: [] } })
    )
    statisticsService.totalFlood.mockReturnValue(
      of({ success: true, data: { content: [{ value: 10 }, { value: 20 }] } })
    )
    statisticsService.totalTrash.mockReturnValue(
      of({ success: true, data: { content: [{ value: 10 }, { value: 20 }] } })
    )
    statisticsService.totalTraffict.mockReturnValue(
      of({ success: true, data: { content: [{ value: 10 }, { value: 20 }] } })
    )
    statisticsService.totalStreetVendor.mockReturnValue(
      of({ success: true, data: { content: [{ value: 10 }, { value: 20 }] } })
    )
    statisticsService.totalCrowd.mockReturnValue(
      of({ success: true, data: { content: [{ value: 10 }, { value: 20 }] } })
    )
    statisticsService.getStatisticsFlood.mockReturnValue(
      of({ labels: [], data: [], seriesNames: [] })
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
        { snapshotCreated: "2023-01-03T00:00:00", value: 200 }
      ]
    }
    const result = component.calculatePercentageChange(mockData)
    expect(result).toBeDefined()
    expect(result?.percentageChange).toBeDefined()
  })

  it("should handle empty data in calculatePercentageChange", () => {
    const mockData = {
      content: []
    }
    const result = component.calculatePercentageChange(mockData)
    expect(result).toBeNull()
  })

  it("should handle null values in calculatePercentageChange", () => {
    const mockData = {
      content: [
        { snapshotCreated: "2023-01-01T00:00:00", value: null },
        { snapshotCreated: "2023-01-02T00:00:00", value: 150 }
      ]
    }
    const result = component.calculatePercentageChange(mockData)
    expect(result).toBeDefined()
  })

  it("should handle API error responses", () => {
    statisticsService.totalFlood.mockReturnValue(throwError(() => new Error("API Error")))
    component.fetchData()
    expect(component.totalFlood).toEqual([0])
  })

  it("should handle unsuccessful API responses", () => {
    statisticsService.totalFlood.mockReturnValue(of({ success: false, data: null }))
    component.fetchData()
    expect(component.totalFlood).toEqual([0])
  })

  it("should update chart data for flood", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [100, 150]
    }
    component.updateChartFlood(mockData)
    expect(component.chartOptionsFlood).toBeDefined()
    expect(component.chartOptionsFlood.xAxis).toBeDefined()
    expect(component.chartOptionsFlood.series).toBeDefined()
  })

  it("should handle empty chart data for flood", () => {
    const mockData = {
      labels: [],
      data: []
    }
    component.updateChartFlood(mockData)
    expect(component.chartOptionsFlood).toBeDefined()
    expect(component.chartOptionsFlood.xAxis).toBeDefined()
    expect(component.chartOptionsFlood.series).toBeDefined()
  })

  it("should update chart data for trash", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [50, 75]
    }
    component.updateChartTrash(mockData)
    expect(component.chartOptionsTrash).toBeDefined()
    expect(component.chartOptionsTrash.xAxis).toBeDefined()
    expect(component.chartOptionsTrash.series).toBeDefined()
  })

  it("should handle empty chart data for trash", () => {
    const mockData = {
      labels: [],
      data: []
    }
    component.updateChartTrash(mockData)
    expect(component.chartOptionsTrash).toBeDefined()
    expect(component.chartOptionsTrash.xAxis).toBeDefined()
    expect(component.chartOptionsTrash.series).toBeDefined()
  })

  it("should update chart data for traffic", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [200, 250]
    }
    component.updateChartTraffic(mockData)
    expect(component.chartOptionsTraffic).toBeDefined()
    expect(component.chartOptionsTraffic.xAxis).toBeDefined()
    expect(component.chartOptionsTraffic.series).toBeDefined()
  })

  it("should handle empty chart data for traffic", () => {
    const mockData = {
      labels: [],
      data: []
    }
    component.updateChartTraffic(mockData)
    expect(component.chartOptionsTraffic).toBeDefined()
    expect(component.chartOptionsTraffic.xAxis).toBeDefined()
    expect(component.chartOptionsTraffic.series).toBeDefined()
  })

  it("should update chart data for street vendor", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [10, 15]
    }
    component.updateChartStreetVendor(mockData)
    expect(component.chartOptionsStreetVendor).toBeDefined()
    expect(component.chartOptionsStreetVendor.xAxis).toBeDefined()
    expect(component.chartOptionsStreetVendor.series).toBeDefined()
  })

  it("should handle empty chart data for street vendor", () => {
    const mockData = {
      labels: [],
      data: []
    }
    component.updateChartStreetVendor(mockData)
    expect(component.chartOptionsStreetVendor).toBeDefined()
    expect(component.chartOptionsStreetVendor.xAxis).toBeDefined()
    expect(component.chartOptionsStreetVendor.series).toBeDefined()
  })

  it("should update chart data for crowd", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [500, 600]
    }
    component.updateChartCrowd(mockData)
    expect(component.chartOptionsCrowd).toBeDefined()
    expect(component.chartOptionsCrowd.xAxis).toBeDefined()
    expect(component.chartOptionsCrowd.series).toBeDefined()
  })

  it("should handle empty chart data for crowd", () => {
    const mockData = {
      labels: [],
      data: []
    }
    component.updateChartCrowd(mockData)
    expect(component.chartOptionsCrowd).toBeDefined()
    expect(component.chartOptionsCrowd.xAxis).toBeDefined()
    expect(component.chartOptionsCrowd.series).toBeDefined()
  })

  it("should handle null values in calculateTotal", () => {
    const mockData = {
      content: [
        { value: null },
        { value: 200 },
        { value: undefined }
      ]
    }
    const total = component.calculateTotal(mockData)
    expect(total).toBe(200)
  })

  it("should handle null values in calculatePercentageChange", () => {
    const mockData = {
      content: [
        { snapshotCreated: "2023-01-01T00:00:00", value: null },
        { snapshotCreated: "2023-01-02T00:00:00", value: 150 }
      ]
    }
    const result = component.calculatePercentageChange(mockData)
    expect(result).toBeDefined()
  })

  it("should handle API error responses for all services", () => {
    statisticsService.dataDetection.mockReturnValue(throwError(() => new Error("Error")))
    component.fetchData()
    expect(component.detections).toEqual([])

    statisticsService.totalFlood.mockReturnValue(throwError(() => new Error("Error")))
    component.fetchData()
    expect(component.totalFlood).toEqual([0])
    expect(component.fluktuasiFlood).toBeUndefined()

    statisticsService.totalTrash.mockReturnValue(throwError(() => new Error("Error")))
    component.fetchData()
    expect(component.totalTrash).toEqual([0])
    expect(component.fluktuasiTrash).toBeUndefined()

    statisticsService.totalTraffict.mockReturnValue(throwError(() => new Error("Error")))
    component.fetchData()
    expect(component.totalTraffict).toEqual([0])
    expect(component.fluktuasiTraffict).toBeUndefined()

    statisticsService.totalStreetVendor.mockReturnValue(throwError(() => new Error("Error")))
    component.fetchData()
    expect(component.totalSreetVendor).toEqual([0])
    expect(component.fluktuasiStreetVendor).toBeUndefined()

    statisticsService.totalCrowd.mockReturnValue(throwError(() => new Error("Error")))
    component.fetchData()
    expect(component.totalCrowd).toEqual([0])
    expect(component.fluktuasiCrowd).toBeUndefined()
  })

  it("should handle null response data from all services", () => {
    statisticsService.totalFlood.mockReturnValue(of({ success: true, data: null }))
    component.fetchData()
    expect(component.totalFlood).toEqual([0])
    expect(component.fluktuasiFlood).toBeUndefined()

    statisticsService.totalTrash.mockReturnValue(of({ success: true, data: null }))
    component.fetchData()
    expect(component.totalTrash).toEqual([0])
    expect(component.fluktuasiTrash).toBeUndefined()

    statisticsService.totalTraffict.mockReturnValue(of({ success: true, data: null }))
    component.fetchData()
    expect(component.totalTraffict).toEqual([0])
    expect(component.fluktuasiTraffict).toBeUndefined()

    statisticsService.totalStreetVendor.mockReturnValue(of({ success: true, data: null }))
    component.fetchData()
    expect(component.totalSreetVendor).toEqual([0])
    expect(component.fluktuasiStreetVendor).toBeUndefined()

    statisticsService.totalCrowd.mockReturnValue(of({ success: true, data: null }))
    component.fetchData()
    expect(component.totalCrowd).toEqual([0])
    expect(component.fluktuasiCrowd).toBeUndefined()
  })

  it("should handle malformed response data", () => {
    statisticsService.totalFlood.mockReturnValue(of({ success: true, data: { content: null } }))
    component.fetchData()
    expect(component.totalFlood).toEqual([0])
    expect(component.fluktuasiFlood).toBeUndefined()
  })

  it("should handle errors in chart updates", () => {
    const mockData = null
    component.updateChartFlood(mockData)
    component.updateChartTrash(mockData)
    component.updateChartTraffic(mockData)
    component.updateChartStreetVendor(mockData)
    component.updateChartCrowd(mockData)

    expect(component.chartOptionsFlood).toBeDefined()
    expect(component.chartOptionsTrash).toBeDefined()
    expect(component.chartOptionsTraffic).toBeDefined()
    expect(component.chartOptionsStreetVendor).toBeDefined()
    expect(component.chartOptionsCrowd).toBeDefined()
  })

  it("should handle all time periods in fetchData", () => {
    const timePeriods = ["hari-ini", "minggu-ini", "bulan-ini"]
    const mockEvent = { preventDefault: () => {} } as Event
    
    timePeriods.forEach(period => {
      component.timePeriod = period
      component.fetchData()
      
      expect(statisticsService.dataDetection).toHaveBeenCalledWith(false, {
        type: component.pilihdeteksi,
        startDate: expect.any(String),
        endDate: expect.any(String),
        page: "0",
        size: "20",
        direction: "DESC",
        sort: "SNAPSHOT_CREATED",
        nntk: "nntkdata"
      })
    })
  })

  it("should show alert", () => {
    const mockEvent = { preventDefault: () => {} } as Event
    component.showAlert()
    expect(toastrService.info).toHaveBeenCalledWith("Tombol diklik!")
  })

  it("should handle all detection types", () => {
    const detectionTypes = ["FLOOD", "TRASH", "TRAFFIC", "STREET_VENDOR", "CROWD"]
    
    detectionTypes.forEach(type => {
      component.pilihdeteksi = type
      component.fetchData()
      
      expect(statisticsService.dataDetection).toHaveBeenCalledWith(false, {
        type: type,
        startDate: expect.any(String),
        endDate: expect.any(String),
        page: "0",
        size: "20",
        direction: "DESC",
        sort: "SNAPSHOT_CREATED",
        nntk: "nntkdata"
      })
    })
  })

  it("should calculate fluctuations correctly", () => {
    const content = [{ value: 10 }, { value: 15 }]
    const result = component.calculateFluctuations(content)
    expect(result).toBe(50)
  })

  it("should handle zero first value in calculateFluctuations", () => {
    const content = [{ value: 0 }, { value: 15 }]
    const result = component.calculateFluctuations(content)
    expect(result).toBe(0)
  })

  it("should handle less than two entries in calculateFluctuations", () => {
    const content = [{ value: 10 }]
    const result = component.calculateFluctuations(content)
    expect(result).toBe(0)
  })

  it("should update total chart for flood", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: { "Total Flood": [100, 150] }, // Ensure data structure matches usage
      seriesNames: ["Total Flood"]
    }
    component.updateTotalChartFlood(mockData)
    expect(component.chartOptionsFlood).toBeDefined()
    expect(component.chartOptionsFlood.series).toBeDefined()
    // Type assertion to treat series as an array
    const seriesArray = component.chartOptionsFlood.series as echarts.SeriesOption[]
    expect(seriesArray[0].name).toBe("Total Flood")
    expect(seriesArray[0].data).toEqual([100, 150])
  })

  it("should handle missing data in updateTotalChartFlood", () => {
    component.updateTotalChartFlood(null)
    expect(component.chartOptionsFlood).toBeDefined() // Check if default options are still there or handled gracefully

    component.updateTotalChartFlood({ labels: [], data: {}, seriesNames: [] })
    expect(component.chartOptionsFlood).toBeDefined()
  })

  it("should handle null or invalid data in all chart update methods", () => {
    const invalidDataScenarios = [
      null,
      undefined,
      { labels: [], data: null, seriesNames: [] }, // Missing data object
      { labels: [], data: {}, seriesNames: null }, // Missing seriesNames
      { labels: null, data: {}, seriesNames: [] }  // Missing labels
    ];

    invalidDataScenarios.forEach(invalidData => {
      component.updateChartFlood(invalidData);
      expect(component.chartOptionsFlood).toBeDefined(); // Ensure it doesn't crash and retains default/previous options

      component.updateChartTrash(invalidData);
      expect(component.chartOptionsTrash).toBeDefined();

      component.updateChartTraffic(invalidData);
      expect(component.chartOptionsTraffic).toBeDefined();

      component.updateChartStreetVendor(invalidData);
      expect(component.chartOptionsStreetVendor).toBeDefined();

      component.updateChartCrowd(invalidData);
      expect(component.chartOptionsCrowd).toBeDefined();

      component.updateTotalChartFlood(invalidData); // Also test the total chart update
      // We might need a more specific expectation for total chart if its default differs
      expect(component.chartOptionsFlood).toBeDefined();
    });
  })
})
