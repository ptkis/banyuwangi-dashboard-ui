/** @type {import('jest').Config} */

var config = {
  // verbose: true,
  preset: "jest-preset-angular",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    "maptalks.three": "<rootDir>/node_modules/maptalks.three/dist/index.js",
  },
  transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$|uuid|maptalks|three)"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  collectCoverage: false,
  collectCoverageFrom: ["./src/app/**"],
  coveragePathIgnorePatterns: ["(.stories.ts|.html|module.ts)$"],
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
}

module.exports = config
