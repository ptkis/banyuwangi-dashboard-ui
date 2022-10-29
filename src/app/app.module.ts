import { DATE_PIPE_DEFAULT_TIMEZONE } from "@angular/common"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"

import { NgxEchartsModule } from "ngx-echarts"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

/**
 * Testing echart lazy load
 */
// import * as echarts from "echarts/core"
// // Import line charts, all with Chart suffix
// import { LineChart, PieChart } from "echarts/charts"
// import {
//   TitleComponent,
//   TooltipComponent,
//   GridComponent,
// } from "echarts/components"
// // Import the Canvas renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
// import { CanvasRenderer } from "echarts/renderers";

// echarts.use([
//   TitleComponent,
//   TooltipComponent,
//   GridComponent,
//   LineChart,
//   PieChart,
//   CanvasRenderer,
// ])

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxEchartsModule.forRoot({
      // echarts
      echarts: () => import("echarts"),
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: DATE_PIPE_DEFAULT_TIMEZONE,
      useValue: "+0700",
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
