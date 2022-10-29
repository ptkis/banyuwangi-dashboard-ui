import { moduleMetadata } from "@storybook/angular"
import { CommonModule } from "@angular/common"
import type { Story, Meta } from "@storybook/angular"

import { ChartPanelComponent } from "./chart-panel.component"
import { NgxEchartsModule } from "ngx-echarts"
import { graphic, EChartsOption } from "echarts"

import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"

export default {
  title: "Components/Panel",
  component: ChartPanelComponent,
  decorators: [
    moduleMetadata({
      declarations: [ChartPanelComponent],
      imports: [
        CommonModule,
        NgxEchartsModule.forRoot({
          echarts: () => import("echarts"),
        }),

        MatButtonModule,
        MatIconModule,
      ],
    }),
  ],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/angular/configure/story-layout
    layout: "padded",
  },
} as Meta

const Template: Story<ChartPanelComponent> = (args: ChartPanelComponent) => ({
  props: args,
})

export const ChartPanel = Template.bind({})
ChartPanel.args = {
  title: "Default Title",
}
export const ChartPanel2: Story = (args) => ({
  props: args,
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4">
          <app-chart-panel>
            <ng-template #customTitle>
              <div class="title">{{ title }}</div>
              <button mat-icon-button class="panel_button">
                <mat-icon>filter_list</mat-icon>
              </button>
            </ng-template>

            <ng-template #contentBody>
              <div class="p-2" style="min-height: 200px;">
                {{ body }}
              </div>
            </ng-template>
          </app-chart-panel>
        </div>
        <div class="col-md-4">
          <app-chart-panel>
            <ng-template #customTitle>
              <div class="title">Genangan Air</div>
            </ng-template>

            <ng-template #contentBody>
              <div class="p-2">
                <div echarts [options]="chartOption" style="height: 300px;"></div>
              </div>
            </ng-template>
          </app-chart-panel>
        </div>
      </div>
    </div>
  `,
})
const chartOption: EChartsOption = {
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    axisLine: {
      show: true,
    },
    axisLabel: {
      color: "#fff",
    },
  },
  grid: {
    top: "30px",
    left: "40px",
    bottom: "60px",
  },
  legend: {
    show: true,
    bottom: 0,
    left: 0,
    textStyle: {
      color: "#fff",
      fontSize: "10px",
    },
    itemHeight: 10,
    icon: "circle",
  },
  color: ["rgb(231, 229, 81)", "rgb(35, 99, 158)", "rgb(255, 255, 255)"],
  yAxis: {
    type: "value",
    splitLine: {
      show: false,
    },
    axisLine: {
      show: true,
    },
    axisLabel: {
      color: "#fff",
    },
  },
  series: [
    {
      name: "Data 1",
      data: [150, 230, 224, 218, 135, 147, 260],
      type: "line",
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "#E7E551",
          },
          {
            offset: 1,
            color: "transparent",
          },
        ]),
      },
    },
    {
      name: "Data 2",
      data: [100, 30, 324, 118, 235, 47, 160],
      type: "line",
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "#23639e",
          },
          {
            offset: 1,
            color: "transparent",
          },
        ]),
      },
    },
  ],
}
ChartPanel2.storyName = "Panel Custom Content"
ChartPanel2.args = {
  title: "This panel has custom title and content",
  body: "This is content",
  chartOption,
}
