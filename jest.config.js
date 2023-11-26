module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: ".",
    testRegex : '.(spec|test).ts',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['src/**/*.(t|j)s'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@infra/(.*)$': '<rootDir>/infra/$1',
    },
    watchPathIgnorePatterns: [
      '<rootDir>/data/',
      '<rootDir>/dist/',
      '<rootDir>/docs/',
      '<rootDir>/node_modules/',
      '<rootDir>/scripts/',
    ],
    coveragePathIgnorePatterns: [
      '\\.module\\.ts$',
      '<rootDir>/src/adapters/',
      '<rootDir>/src/commands/',
      '<rootDir>/src/factories/',
      '<rootDir>/src/shared/',
      '<rootDir>/src/templates/',
      '<rootDir>/src/validations/',
      '<rootDir>/src/cli.ts',
      '<rootDir>/src/main.ts',
    ],
    coverageDirectory: '<rootDir>/coverage',
    testEnvironment: 'node',
  };
  