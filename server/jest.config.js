module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [ 'js', 'ts' ],
  moduleNameMapper: {
    '@db/(.*)': '<rootDir>/src/db/$1',
    '@entities/(.*)': '<rootDir>/src/entities/$1',
    '@helpers/(.*)': '<rootDir>/src/helpers/$1',
    '@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
    '@modules/(.*)': '<rootDir>/src/modules/$1',
    '@use-cases/(.*)': '<rootDir>/src/use-cases/$1',
    '@app': '<rootDir>/src/app',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
