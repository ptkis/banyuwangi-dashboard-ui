import { moduleMetadata } from "@storybook/angular"
import { CommonModule } from "@angular/common"
import type { Story, Meta } from "@storybook/angular"

import { ChartPanelComponent } from "./chart-panel.component"

export default {
  title: "Components/Panel",
  component: ChartPanelComponent,
  decorators: [
    moduleMetadata({
      declarations: [ChartPanelComponent],
      imports: [CommonModule],
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
              <span class="material-symbols-outlined">
                filter_list
              </span>
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
              <div class="p-2" style="min-height: 200px;">
                {{ body }}
              </div>
            </ng-template>
          </app-chart-panel>
        </div>
      </div>
    </div>
  `,
})
ChartPanel2.storyName = "Panel Custom Content"
ChartPanel2.args = {
  title: "This panel has custom title and content",
  body: "This is content",
}
