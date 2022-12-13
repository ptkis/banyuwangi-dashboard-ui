import { moduleMetadata } from "@storybook/angular"
import { CommonModule } from "@angular/common"
import type { Story, Meta } from "@storybook/angular"

import { HeaderComponent } from "./header.component"

export default {
  title: "Components/Header",
  component: HeaderComponent,
  decorators: [
    moduleMetadata({
      declarations: [HeaderComponent],
      imports: [CommonModule],
    }),
  ],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/angular/configure/story-layout
    layout: "fullscreen",
  },
} as Meta

const Template: Story<HeaderComponent> = (args: HeaderComponent) => ({
  props: args,
})

export const Header = Template.bind({})
Header.args = {}
