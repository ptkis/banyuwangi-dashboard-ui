import { DatePipe } from "@angular/common"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { FormsModule } from "@angular/forms"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { NgxEchartsModule } from "ngx-echarts"
import { SharedModule } from "src/app/shared/shared.module"
import { dashboardMaterialModules } from "../dashboard.module"
import { chartHttpMockProviders } from "./mocks/chartMockData"

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
  dashboardMaterialModules,
]

export const chartProviders = [DatePipe, chartHttpMockProviders]
