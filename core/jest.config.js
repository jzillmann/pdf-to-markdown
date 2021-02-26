module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./test'],
  transform: { '\\.ts$': ['ts-jest'] },
  testRegex: '(/test/.*|(\\.|/))(test)\\.(ts)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
    'test/(.*)': '<rootDir>/test/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        // allow js in typescript
        allowJs: true,
      },
    },
  },
};
