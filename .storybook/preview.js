import { setCompodocJson } from "@storybook/addon-docs/angular"
import docJson from "../documentation.json"
setCompodocJson(docJson)

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: { inlineStories: true },
  backgrounds: {
    default: "dark",
    values: [
      {
        name: "light",
        value: "#fff",
      },
      {
        name: "dark",
        value: "#020C1C",
      },
      {
        name: "dark 2",
        value: "#523039",
      },
    ],
  },
}
