import { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  rootDir: "..",
  testRegex: '.*\\.e2e-spec\\.ts$',
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.(t|j)s'],
};

export default config;
