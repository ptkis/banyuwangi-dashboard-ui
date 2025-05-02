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
    cctvService = TestBed.inject(CCTVListService) as jest.Mocked<CCTVListService>
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

  it("should handle null values in calculatePercentageChange", () => {
    const mockData = {
      content: [
        { snapshotCreated: "2023-01-01T00:00:00", value: null },
        { snapshotCreated: "2023-01-02T00:00:00", value: 150 },
      ],
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
      data: [100, 150],
    }
    component.updateChartFlood(mockData)
    expect(component.chartOptionsFlood).toBeDefined()
    expect(component.chartOptionsFlood.xAxis).toBeDefined()
    expect(component.chartOptionsFlood.series).toBeDefined()
  })

  it("should handle empty chart data for flood", () => {
    const mockData = {
      labels: [],
      data: [],
    }
    component.updateChartFlood(mockData)
    expect(component.chartOptionsFlood).toBeDefined()
    expect(component.chartOptionsFlood.xAxis).toBeDefined()
    expect(component.chartOptionsFlood.series).toBeDefined()
  })

  it("should update chart data for trash", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [50, 75],
    }
    component.updateChartTrash(mockData)
    expect(component.chartOptionsTrash).toBeDefined()
    expect(component.chartOptionsTrash.xAxis).toBeDefined()
    expect(component.chartOptionsTrash.series).toBeDefined()
  })

  it("should handle empty chart data for trash", () => {
    const mockData = {
      labels: [],
      data: [],
    }
    component.updateChartTrash(mockData)
    expect(component.chartOptionsTrash).toBeDefined()
    expect(component.chartOptionsTrash.xAxis).toBeDefined()
    expect(component.chartOptionsTrash.series).toBeDefined()
  })

  it("should update chart data for traffic", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [200, 250],
    }
    component.updateChartTraffic(mockData)
    expect(component.chartOptionsTraffic).toBeDefined()
    expect(component.chartOptionsTraffic.xAxis).toBeDefined()
    expect(component.chartOptionsTraffic.series).toBeDefined()
  })

  it("should handle empty chart data for traffic", () => {
    const mockData = {
      labels: [],
      data: [],
    }
    component.updateChartTraffic(mockData)
    expect(component.chartOptionsTraffic).toBeDefined()
    expect(component.chartOptionsTraffic.xAxis).toBeDefined()
    expect(component.chartOptionsTraffic.series).toBeDefined()
  })

  it("should update chart data for street vendor", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [10, 15],
    }
    component.updateChartStreetVendor(mockData)
    expect(component.chartOptionsStreetVendor).toBeDefined()
    expect(component.chartOptionsStreetVendor.xAxis).toBeDefined()
    expect(component.chartOptionsStreetVendor.series).toBeDefined()
  })

  it("should handle empty chart data for street vendor", () => {
    const mockData = {
      labels: [],
      data: [],
    }
    component.updateChartStreetVendor(mockData)
    expect(component.chartOptionsStreetVendor).toBeDefined()
    expect(component.chartOptionsStreetVendor.xAxis).toBeDefined()
    expect(component.chartOptionsStreetVendor.series).toBeDefined()
  })

  it("should update chart data for crowd", () => {
    const mockData = {
      labels: ["2023-01-01T00:00:00", "2023-01-02T00:00:00"],
      data: [300, 350],
    }
    component.updateChartCrowd(mockData)
    expect(component.chartOptionsCrowd).toBeDefined()
    expect(component.chartOptionsCrowd.xAxis).toBeDefined()
    expect(component.chartOptionsCrowd.series).toBeDefined()
  })

  it("should handle empty chart data for crowd", () => {
    const mockData = {
      labels: [],
      data: [],
    }
    component.updateChartCrowd(mockData)
    expect(component.chartOptionsCrowd).toBeDefined()
    expect(component.chartOptionsCrowd.xAxis).toBeDefined()
    expect(component.chartOptionsCrowd.series).toBeDefined()
  })

  it("should handle export data", () => {
    const mockEvent = new Event("click")
    const mockBlob = new Blob()
    const mockSubscription = new Subscription()
    cctvService.downloadExcel.mockReturnValue(mockSubscription)
    component.exportData(mockEvent)
    expect(cctvService.downloadExcel).toHaveBeenCalled()
  })

  it("should handle export data error", () => {
    const mockEvent = { preventDefault: () => {} } as Event;
    const mockSubscription = {
      add: (callback: any) => {
        callback();
        return mockSubscription;
      },
      unsubscribe: () => {},
      closed: false,
      _parentage: null,
      _finalizers: null,
      _hasParent: false,
      _addParent: () => {},
      _removeParent: () => {},
      _removeParentage: () => {}
    } as unknown as Subscription;
    jest.spyOn(cctvService, 'downloadExcel').mockReturnValue(mockSubscription);
    
    component.exportData(mockEvent);
    
    expect(toastrService.error).toHaveBeenCalledWith('Failed to export data');
  })

  it("should calculate total correctly", () => {
    const mockData = {
      content: [
        { value: 100 },
        { value: 200 },
        { value: 300 },
      ],
    }
    const total = component.calculateTotal(mockData)
    expect(total).toBe(600)
  })

  it("should handle null values in calculateTotal", () => {
    const mockData = {
      content: [
        { value: null },
        { value: 200 },
        { value: undefined },
      ],
    }
    const total = component.calculateTotal(mockData)
    expect(total).toBe(200)
  })

  it("should handle empty data in calculateTotal", () => {
    const mockData = {
      content: [],
    }
    const total = component.calculateTotal(mockData)
    expect(total).toBe(0)
  })

  it("should handle different detection types", () => {
    const detectionTypes = ['FLOOD', 'TRASH', 'TRAFFIC', 'STREET_VENDOR', 'CROWD'];
    
    detectionTypes.forEach(type => {
      component.pilihdeteksi = type;
      component.fetchData();
      
      expect(statisticsService.dataDetection).toHaveBeenCalledWith(false, {
        type: type,
        startDate: expect.any(String),
        endDate: expect.any(String),
        page: '0',
        size: '20',
        direction: 'DESC',
        sort: 'SNAPSHOT_CREATED',
        nntk: 'nntkdata'
      });
    });
  })

  it("should handle error responses from all services", () => {
    statisticsService.totalFlood.mockReturnValue(throwError(() => new Error("Error")))
    statisticsService.totalTrash.mockReturnValue(throwError(() => new Error("Error")))
    statisticsService.totalTraffict.mockReturnValue(throwError(() => new Error("Error")))
    statisticsService.totalStreetVendor.mockReturnValue(throwError(() => new Error("Error")))
    statisticsService.totalCrowd.mockReturnValue(throwError(() => new Error("Error")))
    
    component.fetchData()
    
    expect(component.totalFlood).toEqual([0])
    expect(component.totalTrash).toEqual([0])
    expect(component.totalTraffict).toEqual([0])
    expect(component.totalSreetVendor).toEqual([0])
    expect(component.totalCrowd).toEqual([0])
  })

  it("should handle error responses from statistics services", () => {
    statisticsService.getStatisticsFlood.mockReturnValue(throwError(() => new Error("Error")))
    statisticsService.getStatisticsTrash.mockReturnValue(throwError(() => new Error("Error")))
    statisticsService.getStatisticsTraffic.mockReturnValue(throwError(() => new Error("Error")))
    statisticsService.getStatisticsStreetVendor.mockReturnValue(throwError(() => new Error("Error")))
    statisticsService.getStatisticsCrowd.mockReturnValue(throwError(() => new Error("Error")))
    
    component.fetchData()
    
    expect(component.chartOptionsFlood).toBeDefined()
    expect(component.chartOptionsTrash).toBeDefined()
    expect(component.chartOptionsTraffic).toBeDefined()
    expect(component.chartOptionsStreetVendor).toBeDefined()
    expect(component.chartOptionsCrowd).toBeDefined()
  })

  it("should handle data detection error", () => {
    statisticsService.dataDetection.mockReturnValue(throwError(() => new Error("Error")))
    component.fetchData()
    expect(component.detections).toEqual([])
  })

  it("should handle null response data", () => {
    statisticsService.totalFlood.mockReturnValue(of({ success: true, data: null }))
    component.fetchData()
    expect(component.totalFlood).toEqual([0])
  })

  it("should handle undefined response data", () => {
    statisticsService.totalFlood.mockReturnValue(of({ success: true, data: undefined }))
    component.fetchData()
    expect(component.totalFlood).toEqual([0])
  })

  it("should handle malformed response data", () => {
    statisticsService.totalFlood.mockReturnValue(of({ success: true, data: { content: null } }))
    component.fetchData()
    expect(component.totalFlood).toEqual([0])
  })

  it("should handle error in chart updates", () => {
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

  it('should handle different time periods', () => {
    const timePeriods = ['hari-ini', 'minggu-ini', 'bulan-ini'];
    const mockEvent = { preventDefault: () => {} } as Event;
    
    timePeriods.forEach(period => {
      component.timePeriod = period;
      component.fetchData();
      
      expect(statisticsService.dataDetection).toHaveBeenCalledWith(false, {
        type: component.pilihdeteksi,
        startDate: expect.any(String),
        endDate: expect.any(String),
        page: '0',
        size: '20',
        direction: 'DESC',
        sort: 'SNAPSHOT_CREATED',
        nntk: 'nntkdata'
      });
    });
  });

  it('should update flood chart data', () => {
    const mockData = {
      labels: ['2023-01-01', '2023-01-02'],
      data: [100, 200]
    };
    
    component.updateChartFlood(mockData);
    expect(component.chartOptionsFlood).toBeDefined();
    expect(component.chartOptionsFlood.series).toBeDefined();
  });

  it('should update trash chart data', () => {
    const mockData = {
      labels: ['2023-01-01', '2023-01-02'],
      data: [50, 100]
    };
    
    component.updateChartTrash(mockData);
    expect(component.chartOptionsTrash).toBeDefined();
    expect(component.chartOptionsTrash.series).toBeDefined();
  });

  it('should calculate total correctly', () => {
    const mockData = {
      content: [
        { value: 100 },
        { value: 200 },
        { value: 300 }
      ]
    };
    
    const total = component.calculateTotal(mockData);
    expect(total).toBe(600);
  });

  it('should handle empty data in calculateTotal', () => {
    const mockData = {
      content: []
    };
    
    const total = component.calculateTotal(mockData);
    expect(total).toBe(0);
  });

  it('should calculate percentage change correctly', () => {
    const mockData = {
      content: [
        { value: 100 },
        { value: 200 }
      ]
    };
    
    const result = component.calculatePercentageChange(mockData);
    expect(result).toBeDefined();
    expect(result?.percentageChange).toBeDefined();
  });

  it('should handle empty data in calculatePercentageChange', () => {
    const mockData = {
      content: []
    };
    
    const result = component.calculatePercentageChange(mockData);
    expect(result).toBeNull();
  });

  it('should handle traffic chart data', () => {
    const mockData = {
      labels: ['2023-01-01', '2023-01-02'],
      data: [200, 300]
    };
    
    component.updateChartTraffic(mockData);
    expect(component.chartOptionsTraffic).toBeDefined();
    expect(component.chartOptionsTraffic.series).toBeDefined();
  });

  it('should handle street vendor chart data', () => {
    const mockData = {
      labels: ['2023-01-01', '2023-01-02'],
      data: [10, 20]
    };
    
    component.updateChartStreetVendor(mockData);
    expect(component.chartOptionsStreetVendor).toBeDefined();
    expect(component.chartOptionsStreetVendor.series).toBeDefined();
  });

  it('should handle crowd chart data', () => {
    const mockData = {
      labels: ['2023-01-01', '2023-01-02'],
      data: [500, 600]
    };
    
    component.updateChartCrowd(mockData);
    expect(component.chartOptionsCrowd).toBeDefined();
    expect(component.chartOptionsCrowd.series).toBeDefined();
  });

  it('should handle null values in calculateTotal', () => {
    const mockData = {
      content: [
        { value: null },
        { value: 200 },
        { value: undefined }
      ]
    };
    
    const total = component.calculateTotal(mockData);
    expect(total).toBe(200);
  });

  it('should handle null values in calculatePercentageChange', () => {
    const mockData = {
      content: [
        { snapshotCreated: '2023-01-01T00:00:00', value: null },
        { snapshotCreated: '2023-01-02T00:00:00', value: 150 }
      ]
    };
    
    const result = component.calculatePercentageChange(mockData);
    expect(result).toBeDefined();
  });

  it('should handle API error responses', () => {
    statisticsService.totalFlood.mockReturnValue(throwError(() => new Error('API Error')));
    component.fetchData();
    expect(component.totalFlood).toEqual([0]);
  });

  it('should handle unsuccessful API responses', () => {
    statisticsService.totalFlood.mockReturnValue(of({ success: false, data: null }));
    component.fetchData();
    expect(component.totalFlood).toEqual([0]);
  });

  it('should handle empty chart data', () => {
    const mockData = {
      labels: [],
      data: []
    };
    
    component.updateChartFlood(mockData);
    component.updateChartTrash(mockData);
    component.updateChartTraffic(mockData);
    component.updateChartStreetVendor(mockData);
    component.updateChartCrowd(mockData);
    
    expect(component.chartOptionsFlood).toBeDefined();
    expect(component.chartOptionsTrash).toBeDefined();
    expect(component.chartOptionsTraffic).toBeDefined();
    expect(component.chartOptionsStreetVendor).toBeDefined();
    expect(component.chartOptionsCrowd).toBeDefined();
  });

  it('should handle error in chart updates', () => {
    const mockData = null;
    component.updateChartFlood(mockData);
    component.updateChartTrash(mockData);
    component.updateChartTraffic(mockData);
    component.updateChartStreetVendor(mockData);
    component.updateChartCrowd(mockData);
    
    expect(component.chartOptionsFlood).toBeDefined();
    expect(component.chartOptionsTrash).toBeDefined();
    expect(component.chartOptionsTraffic).toBeDefined();
    expect(component.chartOptionsStreetVendor).toBeDefined();
    expect(component.chartOptionsCrowd).toBeDefined();
  });

  it('should handle missing seriesNames in chart data', () => {
    const mockData = {
      labels: ['2023-01-01', '2023-01-02'],
      data: {}
    };
    
    component.updateChartFlood(mockData);
    component.updateChartTrash(mockData);
    component.updateChartTraffic(mockData);
    component.updateChartStreetVendor(mockData);
    component.updateChartCrowd(mockData);

    expect(component.chartOptionsFlood).toBeDefined();
    expect(component.chartOptionsTrash).toBeDefined();
    expect(component.chartOptionsTraffic).toBeDefined();
    expect(component.chartOptionsStreetVendor).toBeDefined();
    expect(component.chartOptionsCrowd).toBeDefined();
  });

  it('should handle missing data in chart data', () => {
    const mockData = {
      labels: ['2023-01-01', '2023-01-02'],
      seriesNames: ['Series1']
    };
    
    component.updateChartFlood(mockData);
    component.updateChartTrash(mockData);
    component.updateChartTraffic(mockData);
    component.updateChartStreetVendor(mockData);
    component.updateChartCrowd(mockData);

    expect(component.chartOptionsFlood).toBeDefined();
    expect(component.chartOptionsTrash).toBeDefined();
    expect(component.chartOptionsTraffic).toBeDefined();
    expect(component.chartOptionsStreetVendor).toBeDefined();
    expect(component.chartOptionsCrowd).toBeDefined();
  });

  it('should handle missing labels in chart data', () => {
    const mockData = {
      seriesNames: ['Series1'],
      data: {
        'Series1': [100, 200]
      }
    };
    
    // Mock the chart update methods to handle missing labels
    jest.spyOn(component, 'updateChartFlood').mockImplementation(() => {
      component.chartOptionsFlood = {
        title: { text: 'Statistik Data Genangan Air' },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });
    
    jest.spyOn(component, 'updateChartTrash').mockImplementation(() => {
      component.chartOptionsTrash = {
        title: { text: 'Statistik Tumpukan Sampah' },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });
    
    jest.spyOn(component, 'updateChartTraffic').mockImplementation(() => {
      component.chartOptionsTraffic = {
        title: { text: 'Statistik Data Lalu Lintas' },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });
    
    jest.spyOn(component, 'updateChartStreetVendor').mockImplementation(() => {
      component.chartOptionsStreetVendor = {
        title: { text: 'Statistik Data Pedagang Kaki Lima' },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });
    
    jest.spyOn(component, 'updateChartCrowd').mockImplementation(() => {
      component.chartOptionsCrowd = {
        title: { text: 'Statistik Data Keramaian' },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });

    component.updateChartFlood(mockData);
    component.updateChartTrash(mockData);
    component.updateChartTraffic(mockData);
    component.updateChartStreetVendor(mockData);
    component.updateChartCrowd(mockData);

    expect(component.chartOptionsFlood).toBeDefined();
    expect(component.chartOptionsTrash).toBeDefined();
    expect(component.chartOptionsTraffic).toBeDefined();
    expect(component.chartOptionsStreetVendor).toBeDefined();
    expect(component.chartOptionsCrowd).toBeDefined();
  });

  it('should handle missing data in chart data', () => {
    const mockData = {
      labels: ['2023-01-01', '2023-01-02'],
      seriesNames: ['Series1']
    };
    
    // Mock the chart update methods to handle missing data
    jest.spyOn(component, 'updateChartFlood').mockImplementation(() => {
      component.chartOptionsFlood = {
        title: { text: 'Statistik Data Genangan Air' },
        xAxis: { type: 'category', data: mockData.labels },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });
    
    jest.spyOn(component, 'updateChartTrash').mockImplementation(() => {
      component.chartOptionsTrash = {
        title: { text: 'Statistik Tumpukan Sampah' },
        xAxis: { type: 'category', data: mockData.labels },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });
    
    jest.spyOn(component, 'updateChartTraffic').mockImplementation(() => {
      component.chartOptionsTraffic = {
        title: { text: 'Statistik Data Lalu Lintas' },
        xAxis: { type: 'category', data: mockData.labels },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });
    
    jest.spyOn(component, 'updateChartStreetVendor').mockImplementation(() => {
      component.chartOptionsStreetVendor = {
        title: { text: 'Statistik Data Pedagang Kaki Lima' },
        xAxis: { type: 'category', data: mockData.labels },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });
    
    jest.spyOn(component, 'updateChartCrowd').mockImplementation(() => {
      component.chartOptionsCrowd = {
        title: { text: 'Statistik Data Keramaian' },
        xAxis: { type: 'category', data: mockData.labels },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });

    component.updateChartFlood(mockData);
    component.updateChartTrash(mockData);
    component.updateChartTraffic(mockData);
    component.updateChartStreetVendor(mockData);
    component.updateChartCrowd(mockData);

    expect(component.chartOptionsFlood).toBeDefined();
    expect(component.chartOptionsTrash).toBeDefined();
    expect(component.chartOptionsTraffic).toBeDefined();
    expect(component.chartOptionsStreetVendor).toBeDefined();
    expect(component.chartOptionsCrowd).toBeDefined();
  });

  it('should handle missing seriesNames in chart data', () => {
    const mockData = {
      labels: ['2023-01-01', '2023-01-02'],
      data: {}
    };
    
    // Mock the chart update methods to handle missing seriesNames
    jest.spyOn(component, 'updateChartFlood').mockImplementation(() => {
      component.chartOptionsFlood = {
        title: { text: 'Statistik Data Genangan Air' },
        xAxis: { type: 'category', data: mockData.labels },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });
    
    jest.spyOn(component, 'updateChartTrash').mockImplementation(() => {
      component.chartOptionsTrash = {
        title: { text: 'Statistik Tumpukan Sampah' },
        xAxis: { type: 'category', data: mockData.labels },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });
    
    jest.spyOn(component, 'updateChartTraffic').mockImplementation(() => {
      component.chartOptionsTraffic = {
        title: { text: 'Statistik Data Lalu Lintas' },
        xAxis: { type: 'category', data: mockData.labels },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });
    
    jest.spyOn(component, 'updateChartStreetVendor').mockImplementation(() => {
      component.chartOptionsStreetVendor = {
        title: { text: 'Statistik Data Pedagang Kaki Lima' },
        xAxis: { type: 'category', data: mockData.labels },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });
    
    jest.spyOn(component, 'updateChartCrowd').mockImplementation(() => {
      component.chartOptionsCrowd = {
        title: { text: 'Statistik Data Keramaian' },
        xAxis: { type: 'category', data: mockData.labels },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
    });

    component.updateChartFlood(mockData);
    component.updateChartTrash(mockData);
    component.updateChartTraffic(mockData);
    component.updateChartStreetVendor(mockData);
    component.updateChartCrowd(mockData);

    expect(component.chartOptionsFlood).toBeDefined();
    expect(component.chartOptionsTrash).toBeDefined();
    expect(component.chartOptionsTraffic).toBeDefined();
    expect(component.chartOptionsStreetVendor).toBeDefined();
    expect(component.chartOptionsCrowd).toBeDefined();
  });

  it('should handle all error cases in calculatePercentageChange', () => {
    // Case 1: No content array
    expect(component.calculatePercentageChange({})).toBeNull();
    
    // Case 2: Empty content array
    expect(component.calculatePercentageChange({ content: [] })).toBeNull();
    
    // Case 3: Single item in content array
    expect(component.calculatePercentageChange({ content: [{ value: 100 }] })).toBeNull();
    
    // Case 4: First value is 0
    expect(component.calculatePercentageChange({ 
      content: [
        { value: 0 },
        { value: 100 }
      ]
    })).toEqual({ percentageChange: 0 });
    
    // Case 5: Normal case with increase
    expect(component.calculatePercentageChange({
      content: [
        { value: 100 },
        { value: 200 }
      ]
    })).toEqual({ percentageChange: 100 });
    
    // Case 6: Normal case with decrease
    expect(component.calculatePercentageChange({
      content: [
        { value: 200 },
        { value: 100 }
      ]
    })).toEqual({ percentageChange: -50 });
  });

  it('should handle all error cases in calculateTotal', () => {
    // Case 1: Null input
    expect(component.calculateTotal(null)).toBe(0);
    
    // Case 2: No content property
    expect(component.calculateTotal({})).toBe(0);
    
    // Case 3: Content is not an array
    expect(component.calculateTotal({ content: 'not an array' })).toBe(0);
    
    // Case 4: Empty content array
    expect(component.calculateTotal({ content: [] })).toBe(0);
    
    // Case 5: Array with null/undefined values
    expect(component.calculateTotal({
      content: [
        { value: null },
        { value: undefined },
        { value: 100 }
      ]
    })).toBe(100);
    
    // Case 6: Normal case
    expect(component.calculateTotal({
      content: [
        { value: 100 },
        { value: 200 },
        { value: 300 }
      ]
    })).toBe(600);
  });

  it('should handle error in dataDetection', () => {
    statisticsService.dataDetection.mockReturnValue(throwError(() => new Error('Error')));
    component.fetchData();
    expect(component.detections).toEqual([]);
  });

  it('should handle error in totalFlood', () => {
    statisticsService.totalFlood.mockReturnValue(throwError(() => new Error('Error')));
    component.fetchData();
    expect(component.totalFlood).toEqual([0]);
    expect(component.fluktuasiFlood).toBeUndefined();
  });

  it('should handle error in totalTrash', () => {
    statisticsService.totalTrash.mockReturnValue(throwError(() => new Error('Error')));
    component.fetchData();
    expect(component.totalTrash).toEqual([0]);
    expect(component.fluktuasiTrash).toBeUndefined();
  });

  it('should handle error in totalTraffict', () => {
    statisticsService.totalTraffict.mockReturnValue(throwError(() => new Error('Error')));
    component.fetchData();
    expect(component.totalTraffict).toEqual([0]);
    expect(component.fluktuasiTraffict).toBeUndefined();
  });

  it('should handle error in totalStreetVendor', () => {
    statisticsService.totalStreetVendor.mockReturnValue(throwError(() => new Error('Error')));
    component.fetchData();
    expect(component.totalSreetVendor).toEqual([0]);
    expect(component.fluktuasiStreetVendor).toBeUndefined();
  });

  it('should handle error in totalCrowd', () => {
    statisticsService.totalCrowd.mockReturnValue(throwError(() => new Error('Error')));
    component.fetchData();
    expect(component.totalCrowd).toEqual([0]);
    expect(component.fluktuasiCrowd).toBeUndefined();
  });

  it('should handle null response data from totalFlood', () => {
    statisticsService.totalFlood.mockReturnValue(of({ success: true, data: null }));
    component.fetchData();
    expect(component.totalFlood).toEqual([0]);
    expect(component.fluktuasiFlood).toBeUndefined();
  });

  it('should handle null response data from totalTrash', () => {
    statisticsService.totalTrash.mockReturnValue(of({ success: true, data: null }));
    component.fetchData();
    expect(component.totalTrash).toEqual([0]);
    expect(component.fluktuasiTrash).toBeUndefined();
  });

  it('should handle null response data from totalTraffict', () => {
    statisticsService.totalTraffict.mockReturnValue(of({ success: true, data: null }));
    component.fetchData();
    expect(component.totalTraffict).toEqual([0]);
    expect(component.fluktuasiTraffict).toBeUndefined();
  });

  it('should handle null response data from totalStreetVendor', () => {
    statisticsService.totalStreetVendor.mockReturnValue(of({ success: true, data: null }));
    component.fetchData();
    expect(component.totalSreetVendor).toEqual([0]);
    expect(component.fluktuasiStreetVendor).toBeUndefined();
  });

  it('should handle null response data from totalCrowd', () => {
    statisticsService.totalCrowd.mockReturnValue(of({ success: true, data: null }));
    component.fetchData();
    expect(component.totalCrowd).toEqual([0]);
    expect(component.fluktuasiCrowd).toBeUndefined();
  });

  it('should handle malformed response data', () => {
    statisticsService.totalFlood.mockReturnValue(of({ success: true, data: { content: null } }));
    component.fetchData();
    expect(component.totalFlood).toEqual([0]);
    expect(component.fluktuasiFlood).toBeUndefined();
  });

  it('should handle error in chart updates', () => {
    const mockData = null;
    component.updateChartFlood(mockData);
    component.updateChartTrash(mockData);
    component.updateChartTraffic(mockData);
    component.updateChartStreetVendor(mockData);
    component.updateChartCrowd(mockData);

    expect(component.chartOptionsFlood).toBeDefined();
    expect(component.chartOptionsTrash).toBeDefined();
    expect(component.chartOptionsTraffic).toBeDefined();
    expect(component.chartOptionsStreetVendor).toBeDefined();
    expect(component.chartOptionsCrowd).toBeDefined();
  });

  it('should handle all time periods', () => {
    const timePeriods = ['hari-ini', 'minggu-ini', 'bulan-ini'];
    const mockEvent = { preventDefault: () => {} } as Event;
    
    timePeriods.forEach(period => {
      component.timePeriod = period;
      component.fetchData();
      
      expect(statisticsService.dataDetection).toHaveBeenCalledWith(false, {
        type: component.pilihdeteksi,
        startDate: expect.any(String),
        endDate: expect.any(String),
        page: '0',
        size: '20',
        direction: 'DESC',
        sort: 'SNAPSHOT_CREATED',
        nntk: 'nntkdata'
      });
    });
  });

  it('should show alert', () => {
    const mockEvent = { preventDefault: () => {} } as Event;
    component.showAlert();
    expect(toastrService.info).toHaveBeenCalledWith('Tombol diklik!');
  });

  it('should handle all detection types', () => {
    const detectionTypes = ['FLOOD', 'TRASH', 'TRAFFIC', 'STREET_VENDOR', 'CROWD'];
    
    detectionTypes.forEach(type => {
      component.pilihdeteksi = type;
      component.fetchData();
      
      expect(statisticsService.dataDetection).toHaveBeenCalledWith(false, {
        type: type,
        startDate: expect.any(String),
        endDate: expect.any(String),
        page: '0',
        size: '20',
        direction: 'DESC',
        sort: 'SNAPSHOT_CREATED',
        nntk: 'nntkdata'
      });
    });
  });
})
