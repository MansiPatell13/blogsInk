module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'node',
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',
  
  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/tests'],
  
  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  
  // An array of regexp pattern strings that are matched against all test paths
  testPathIgnorePatterns: ['/node_modules/'],
  
  // A map from regular expressions to paths to transformers
  transform: {},
  
  // An array of regexp pattern strings that are matched against all source file paths
  // before re-running tests related to the changed files
  watchPathIgnorePatterns: ['node_modules'],
  
  // The maximum amount of workers used to run your tests
  maxWorkers: '50%',
  
  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ['node_modules'],
  
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  
  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Setup files after environment is set up
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // The test timeout in milliseconds
  testTimeout: 30000
};