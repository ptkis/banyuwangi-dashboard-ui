import "jest-preset-angular/setup-jest"
import "jest-canvas-mock"

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
