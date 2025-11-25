export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          target: 'ES2023',
          esModuleInterop: true,
          moduleResolution: 'node',
        },
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@prisma)/)',
  ],
};
