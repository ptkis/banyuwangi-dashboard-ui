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
})
