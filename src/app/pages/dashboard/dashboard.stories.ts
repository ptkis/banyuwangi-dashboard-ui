import { moduleMetadata } from "@storybook/angular"
import { CommonModule } from "@angular/common"
import type { Story, Meta } from "@storybook/angular"

import { NgxEchartsModule } from "ngx-echarts"

import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { DialogModule } from "@angular/cdk/dialog"

import { dashboardComponents } from "."
import { dashboardDialogs } from "./dialogs"
import { RouterTestingModule } from "@angular/router/testing"
import { DashboardComponent } from "./dashboard.component"
import { SharedModule } from "src/app/shared/shared.module"
import { dashboardRoutes } from "./dashboard.module"

export default {
  title: "Dashboard/Components",
  component: DashboardComponent,
  decorators: [
    moduleMetadata({
      declarations: [dashboardComponents, dashboardDialogs],
      imports: [
        CommonModule,
        SharedModule,
        NgxEchartsModule.forRoot({
          echarts: () => import("echarts"),
        }),
        RouterTestingModule.withRoutes(dashboardRoutes),
        MatButtonModule,
        MatIconModule,
        DialogModule,
      ],
    }),
  ],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/angular/configure/story-layout
    layout: "fullscreen",
  },
} as Meta

const Template: Story<DashboardComponent> = (args: DashboardComponent) => ({
  props: args,
})

export const DashboardPage = Template.bind({})
DashboardPage.args = {}
