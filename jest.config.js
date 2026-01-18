module.exports = {
  rootDir: './frontend/src',
  testEnvironment: 'jsdom',
  transform: {'^.+\\.[tj]sx?$': 'babel-jest'},
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '^react$': require.resolve('react'),
    '^react-dom$': require.resolve('react-dom'),
  },
};
