module.exports = {
  rootDir: __dirname,
  clearMocks: true,
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^test/(.*)$": "<rootDir>/test/$1"
  },
  testMatch: ["<rootDir>/spec/feature/**/*.js"]
};
