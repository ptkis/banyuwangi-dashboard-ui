import { DatePipe } from "@angular/common"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { FormsModule } from "@angular/forms"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { NgxEchartsModule } from "ngx-echarts"
import { ListFilterComponent } from "src/app/shared/components/list-filter/list-filter.component"
import { SharedModule } from "src/app/shared/shared.module"
import { getTranslocoModule } from "src/app/transloco-testing.module"
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
  getTranslocoModule(),
  ListFilterComponent,
]

export const chartProviders = [DatePipe, chartHttpMockProviders]
