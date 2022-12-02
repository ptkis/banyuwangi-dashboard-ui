import { moduleMetadata } from "@storybook/angular"
import { CommonModule } from "@angular/common"
import type { Story, Meta } from "@storybook/angular"

import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { WsVideoComponent } from "./ws-video.component"

export default {
  title: "Components/Videos",
  component: WsVideoComponent,
  decorators: [
    moduleMetadata({
      declarations: [WsVideoComponent],
      imports: [CommonModule, MatButtonModule, MatIconModule],
    }),
  ],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/angular/configure/story-layout
    layout: "padded",
  },
} as Meta

const Template: Story<WsVideoComponent> = (args: WsVideoComponent) => ({
  props: args,
})

export const WSVideo = Template.bind({})
WSVideo.args = {}
