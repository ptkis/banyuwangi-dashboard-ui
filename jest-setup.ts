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

jest.mock("maptalks", () => {
  const maptalks = jest.requireActual("maptalks")
  return {
    ...maptalks,
    SpatialReference: {
      loadArcgis: (url: string, cb: any) => {
        console.log("sx")
        cb(null, {
          spatialReference: {
            projection: "",
            fullExtent: null,
          },
        })
      },
    },
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

jest.mock("xlsx", () => {
  const original = jest.requireActual("xlsx")

  return {
    ...original,
    writeFile: (data: any, filename: any, opts: any) => {},
  }
})
