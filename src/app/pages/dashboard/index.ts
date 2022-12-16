import { ChartOverlayComponent } from "./chart-overlay/chart-overlay.component"
import { CrowdChartComponent } from "./chart-overlay/crowd-chart/crowd-chart.component"
import { FloodChartComponent } from "./chart-overlay/flood-chart/flood-chart.component"
import { LineChartComponent } from "./chart-overlay/line-chart/line-chart.component"
import { StreetVendorChartComponent } from "./chart-overlay/street-vendor-chart/street-vendor-chart.component"
import { TrafficChartComponent } from "./chart-overlay/traffic-chart/traffic-chart.component"
import { TrashChartComponent } from "./chart-overlay/trash-chart/trash-chart.component"
import { ChartComponentComponent } from "./components/chart-component/chart-component.component"
import { HeaderComponent } from "./components/header/header.component"
import { ListFilterComponent } from "./components/list-filter/list-filter.component"
import { DashboardComponent } from "./dashboard.component"
import { MapDashboardComponent } from "./map-dashboard/map-dashboard.component"
import { Map3dDashboardComponent } from "./map3d-dashboard/map3d-dashboard.component"

export const dashboardComponents = [
  DashboardComponent,
  HeaderComponent,
  ChartOverlayComponent,
  ListFilterComponent,
  MapDashboardComponent,
  Map3dDashboardComponent,

  ChartComponentComponent,
  LineChartComponent,
  FloodChartComponent,
  StreetVendorChartComponent,
  TrafficChartComponent,
  TrashChartComponent,
  CrowdChartComponent,
]
