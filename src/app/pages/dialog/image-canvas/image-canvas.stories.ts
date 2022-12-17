import { moduleMetadata } from "@storybook/angular"
import { CommonModule } from "@angular/common"
import type { Story, Meta } from "@storybook/angular"
import { ImageCanvasComponent } from "./image-canvas.component"

export default {
  title: "Components/Image Canvas",
  component: ImageCanvasComponent,
  decorators: [
    moduleMetadata({
      declarations: [ImageCanvasComponent],
      imports: [CommonModule],
    }),
  ],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/angular/configure/story-layout
    layout: "fullscreen",
  },
} as Meta

const Template: Story<ImageCanvasComponent> = (args: ImageCanvasComponent) => ({
  props: args,
})

export const ImageCanvas = Template.bind({})
ImageCanvas.args = {
  chartImageContent: {
    date: "2020-06-06",
    instant: "2020-06-06T02:28:48Z",
    location: "Kampung Melayu",
    cameraName: "Camera 1",
    type: "TRASH",
    value: 3,
    imageSrc: "https://loremflickr.com/415/233",
    annotations: [
      {
        boundingBox: {
          x: 0.162,
          y: 0.357,
          width: 0.25,
          height: 0.545,
          id: "e5f356c3-a365-4a63-916b-dbc3bcda6bb7",
        },
        confidence: 0.96922,
      },
      {
        boundingBox: {
          x: 0.152,
          y: 0.249,
          width: 0.558,
          height: 0.57,
          id: "7a79b187-92c1-452e-8eb4-589f9b4919a5",
        },
        confidence: 0.66656,
      },
      {
        boundingBox: {
          x: 0.61,
          y: 0.131,
          width: 0.167,
          height: 0.284,
          id: "90f39b2b-c9cf-45a1-a3a1-4d292c9cb3e3",
        },
        confidence: 0.62682,
      },
    ],
  },
}
