/** @type {import('jest').Config} */

var config = {
  // verbose: true,
  preset: "jest-preset-angular",
  testEnvironment: "jsdom",
  // testEnvironment: "@happy-dom/jest-environment",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    "maptalks.three": "<rootDir>/node_modules/maptalks.three/dist/index.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!.*\\.mjs$|uuid|maptalks|three|css|scss)",
  ],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  collectCoverage: false,
  collectCoverageFrom: ["./src/app/**"],
  coveragePathIgnorePatterns: [
    "(.stories.ts|.html|module.ts|.json|guards|mock)",
  ],
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 75,
      functions: 75,
      lines: 75,
    },
    "./src/app/pages/**/*.ts": {
      statements: 75,
      branches: 75,
      functions: 75,
      lines: 75,
    },
    "./src/app/shared/**/*.ts": {
      statements: 75,
      branches: 75,
      functions: 75,
      lines: 75,
    },
  },
}

module.exports = config
