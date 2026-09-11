import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // e2e/ holds Playwright specs, which use @playwright/test's own test/expect
  // globals — incompatible with Jest's, and meant to run against a live
  // server via `npm run test:e2e`, not the unit test suite.
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/e2e/'],
  // .worktrees/ holds alternate checkouts of this same repo (see .gitignore).
  // Left to itself Jest's module map crawls them, finds a second package.json
  // with the same name, warns about the collision and takes ten times longer.
  modulePathIgnorePatterns: ['<rootDir>/.worktrees/'],
};

export default createJestConfig(config);
