import { DATE_PIPE_DEFAULT_TIMEZONE } from "@angular/common"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { HeaderComponent } from "./header/header.component"
import { SharedModule } from "./shared/shared.module"

import { NgxEchartsModule } from "ngx-echarts"
import * as echarts from "echarts/core"
// Import bar charts, all with Chart suffix
import { LineChart } from "echarts/charts"
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components"
// Import the Canvas renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import { CanvasRenderer } from "echarts/renderers"
import "echarts/theme/macarons.js"

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
])

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    NgxEchartsModule.forRoot({ echarts }),
  ],
  providers: [
    {
      provide: DATE_PIPE_DEFAULT_TIMEZONE,
      useValue: "+0800",
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
