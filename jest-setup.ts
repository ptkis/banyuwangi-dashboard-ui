import "jest-preset-angular/setup-jest"
import "@testing-library/jest-dom/extend-expect"
import "jest-canvas-mock"
import { jestPreviewConfigure } from "jest-preview"
import "@ng-web-apis/universal/mocks"

jestPreviewConfigure({ autoPreview: true })

const nodeCrypto = require("crypto")

Object.defineProperty(window, "crypto", {
  value: {
    getRandomValues: (arr: any) => nodeCrypto.randomFillSync(arr),
  },
})

window.MutationObserver = window.ResizeObserver = jest
  .fn()
  .mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))

jest.mock("three", () => {
  const THREE = jest.requireActual("three")
  return {
    ...THREE,
    WebGLRenderer: jest.fn().mockReturnValue({
      domElement: document.createElement("div"), // create a fake div
      setSize: jest.fn(),
      render: jest.fn(),
    }),
  }
})

jest.mock("three/examples/jsm/loaders/SVGLoader", () => {
  const svgL = jest.requireActual("three/examples/jsm/loaders/SVGLoader")
  const svgLoader = new svgL.SVGLoader()
  const data = svgLoader.parse(`<svg height="100" width="100">
      <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
      Sorry, your browser does not support inline SVG.
    </svg> `)
  class mockSVGLoader extends svgL.SVGLoader {
    constructor() {
      super()
    }

    load = (dt, cb) => {
      cb(data)
    }
  }
  return {
    ...svgL,
    SVGLoader: mockSVGLoader,
  }
})

jest.mock("maptalks.three", () => {
  const mapthree = jest.requireActual("maptalks.three")
  class mockThreeLayer extends mapthree["ThreeLayer"] {
    getScene() {
      return {
        add: jest.fn(),
        children: [],
      }
    }
  }

  return {
    ...mapthree,
    ThreeLayer: mockThreeLayer,
  }
})

// class mockXHR {
//   open = jest.fn()
//   send = jest.fn()
//   setRequestHeader = jest.fn()
//   addEventListener = ({load}) => console.log(load)

//   constructor() {}
// }

// Object.defineProperty(window, "XMLHttpRequest", {
//   value: mockXHR
// })

class JSPlugin {
  constructor(obj: object) {}

  JS_Play(url: string, data: object, window: number) {
    return new Promise((resolve, reject) => {
      if (url.includes("failed")) {
        reject({
          oError: {
            statusString: "y",
          },
        })
      } else {
        resolve("foo")
      }
    })
  }

  JS_Stop(foo: any) {
    return true
  }
}

;(window as any)["JSPlugin"] = JSPlugin
