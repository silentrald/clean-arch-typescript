module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // moduleFileExtensions: [ 'js', 'ts' ],
  moduleNameMapper: {
    '@app': '<rootDir>/src/app',
    '@db': '<rootDir>/src/db',
    '@intf/(.*)': '<rootDir>/src/intf/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
