/**
 * Unit-test configuration.
 *
 * We deliberately scope tests to the pure business logic in `src/utils` (role
 * permissions, menu/cart calculations, param parsing). These functions are
 * deterministic and free of native/UI dependencies, so they run under a plain
 * ts-jest + node setup with no Expo/React Native mocking required.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
};
