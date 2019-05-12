module.exports = {
  notify: true,
  verbose: true,
  rootDir: '../',
  testMatch: ['**/*.spec.js'],
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}
