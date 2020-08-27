module.exports = {
  rootDir: __dirname,
  clearMocks: true,
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^spec/(.*)$': '<rootDir>/spec/$1',
  },
  testMatch: ['<rootDir>/spec/feature/**/*.js'],
};
