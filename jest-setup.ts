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
