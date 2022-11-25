/** @type {import('jest').Config} */

var config = {
  // verbose: true,
  preset: "jest-preset-angular",
  testEnvironment: "@happy-dom/jest-environment",
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
  collectCoverage: true,
  collectCoverageFrom: ["./src/app/**"],
  coveragePathIgnorePatterns: ["(.stories.ts|.html|module.ts)$"],
  coverageReporters: "",
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
}

module.exports = config
