import { DatePipe } from "@angular/common"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { FormsModule } from "@angular/forms"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { NgxEchartsModule } from "ngx-echarts"
import { SharedModule } from "src/app/shared/shared.module"
import { CrowdChartComponent } from "./crowd-chart/crowd-chart.component"
import { FloodChartComponent } from "./flood-chart/flood-chart.component"
import { chartHttpMockProviders } from "./mocks/chartMockData"
import { StreetVendorChartComponent } from "./street-vendor-chart/street-vendor-chart.component"
import { TrafficChartComponent } from "./traffic-chart/traffic-chart.component"
import { TrashChartComponent } from "./trash-chart/trash-chart.component"

// For testing
export const chartImportedModules = [
  NoopAnimationsModule,
  HttpClientTestingModule,
  SharedModule,
  NgxEchartsModule.forRoot({
    // echarts
    echarts: () => import("echarts"),
  }),
  FormsModule,
]

export const chartProviders = [DatePipe, chartHttpMockProviders]

export const chartComponents = [
  FloodChartComponent,
  StreetVendorChartComponent,
  TrafficChartComponent,
  TrashChartComponent,
  CrowdChartComponent,
]
