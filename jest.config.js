/** @type {import('jest').Config} */

var config = {
  // verbose: true,
  preset: "jest-preset-angular",
  testEnvironment: "jsdom",
  // testEnvironment: "@happy-dom/jest-environment",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    "maptalks.three": "<rootDir>/node_modules/maptalks.three/dist/index.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!.*\\.mjs$|uuid|maptalks|three|css|scss|@firebase|@angular/fire|date-fns)",
  ],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
      stringifyContentPathRegex: "\\.(html|svg)$",
    },
  },
  collectCoverage: false,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.module.ts",
    "!src/main.ts",
    "!src/polyfills.ts",
    "!src/environments/**/*.ts"
  ],
  coveragePathIgnorePatterns: [
    "(.stories.ts|.html|module.ts|.json|guards|mock|app.component|app.service|map-dashboard.component|pages/live|hik-video-2|service.ts|list-filter|notification-list|search|line-chart|proxy-image|image-canvas|shared/services)",
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
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
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  coverageDirectory: '<rootDir>/coverage',
}

module.exports = config
