module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./'],
  transform: { '\\.ts$': ['ts-jest'] },
  testRegex: '(/test/.*|(\\.|/)(test|spec))\\.(ts)$',
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
