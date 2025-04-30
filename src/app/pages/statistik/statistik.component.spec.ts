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
import { expect } from '@jest/globals';

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

    const cctvMock = {} as unknown as jest.Mocked<CCTVListService>
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
          echarts: () => import('echarts')
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
                get: () => null,
              },
            },
          },
        }
      ]
    }).compileComponents()

    statisticsService = TestBed.inject(StatisticsService) as jest.Mocked<StatisticsService>
    cctvService = TestBed.inject(CCTVListService) as jest.Mocked<CCTVListService>
    toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>

    // Setup mock responses
    statisticsService.dataDetection.mockReturnValue(of({ data: { content: [] } }))
    statisticsService.totalFlood.mockReturnValue(of({ success: true, data: { content: [] } }))
    statisticsService.totalTrash.mockReturnValue(of({ success: true, data: { content: [] } }))
    statisticsService.totalTraffict.mockReturnValue(of({ success: true, data: { content: [] } }))
    statisticsService.totalStreetVendor.mockReturnValue(of({ success: true, data: { content: [] } }))
    statisticsService.totalCrowd.mockReturnValue(of({ success: true, data: { content: [] } }))
    statisticsService.getStatisticsFlood.mockReturnValue(of({}))
    statisticsService.getStatisticsTrash.mockReturnValue(of({}))
    statisticsService.getStatisticsTraffic.mockReturnValue(of({}))
    statisticsService.getStatisticsStreetVendor.mockReturnValue(of({}))
    statisticsService.getStatisticsCrowd.mockReturnValue(of({}))

    fixture = TestBed.createComponent(StatistikComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should handle hari-ini time period", () => {
    component.timePeriod = "hari-ini"
    component.fetchData()
    expect(component.startDate).toBe(format(new Date(), "yyyy-MM-dd"))
    expect(component.endDate).toBe(format(new Date(), "yyyy-MM-dd"))
  })

  it("should handle minggu-ini time period", () => {
    component.timePeriod = "minggu-ini"
    component.fetchData()
    expect(component.startDate).toBe(format(subWeeks(new Date(), 1), "yyyy-MM-dd"))
    expect(component.endDate).toBe(format(new Date(), "yyyy-MM-dd"))
  })

  it("should handle bulan-ini time period", () => {
    component.timePeriod = "bulan-ini"
    component.fetchData()
    expect(component.startDate).toBe(format(subMonths(new Date(), 1), "yyyy-MM-dd"))
    expect(component.endDate).toBe(format(new Date(), "yyyy-MM-dd"))
  })

  it("should calculate percentage change correctly", () => {
    const mockData = {
      content: [
        { value: 100 },
        { value: 150 },
        { value: 200 }
      ]
    }
    const result = component.calculatePercentageChange(mockData)
    expect(result).toBeDefined()
    if (result) {
      expect(result.percentageChange).toBeDefined()
    }
  })

  it("should handle empty data in calculatePercentageChange", () => {
    const mockData = {
      content: []
    }
    const result = component.calculatePercentageChange(mockData)
    expect(result).toBeNull()
  })

  it("should update flood chart data", () => {
    const mockData = {
      content: [
        { value: 100, timestamp: "2024-01-01" },
        { value: 150, timestamp: "2024-01-02" }
      ]
    }
    component.updateChartFlood(mockData)
    expect(component.chartOptionsFlood).toBeDefined()
  })

  it("should update trash chart data", () => {
    const mockData = {
      content: [
        { value: 50, timestamp: "2024-01-01" },
        { value: 75, timestamp: "2024-01-02" }
      ]
    }
    component.updateChartTrash(mockData)
    expect(component.chartOptionsTrash).toBeDefined()
  })

  it("should update traffic chart data", () => {
    const mockData = {
      content: [
        { value: 200, timestamp: "2024-01-01" },
        { value: 250, timestamp: "2024-01-02" }
      ]
    }
    component.updateChartTraffic(mockData)
    expect(component.chartOptionsTraffic).toBeDefined()
  })

  it("should handle export data", () => {
    const mockEvent = { preventDefault: jest.fn() } as unknown as Event
    component.exportData(mockEvent)
    expect(mockEvent.preventDefault).toHaveBeenCalled()
  })

  it("should initialize with default values", () => {
    expect(component.pilihdeteksi).toBe("FLOOD")
    expect(component.totalFlood).toEqual([0])
    expect(component.totalTrash).toEqual([0])
    expect(component.totalTraffict).toEqual([0])
    expect(component.totalSreetVendor).toEqual([0])
    expect(component.totalCrowd).toEqual([0])
  })

  it("should handle detection type changes", () => {
    component.pilihdeteksi = "TRASH"
    component.fetchData()
    expect(statisticsService.dataDetection).toHaveBeenCalledWith(
      false,
      expect.objectContaining({
        type: "TRASH"
      })
    )
  })
})
