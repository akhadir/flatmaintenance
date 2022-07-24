module.exports = {
    verbose: true,
    testEnvironment: 'jest-environment-jsdom',
    coverageDirectory: './reports',
    // testResultsProcessor: 'jest-sonar-reporter',
    // clearMocks: true automatically clears all Jest mocks after each test
    clearMocks: true,
    collectCoverage: true,
    setupFilesAfterEnv: ['<rootDir>/.setup.js'],
    testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
    coverageReporters: ['text', 'html', 'cobertura', 'lcov'],
    reporters: ['default', 'jest-junit'],
    globalSetup: './global-setup.js',
    coverageThreshold: {
        global: {
            branches: 15,
            functions: 15,
            lines: 15,
            statements: 15,
        },
    },
    testPathIgnorePatterns: ['/.history/', '/node_modules/', '/tests/', '/examples/', '/dist/', '/config/'],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/config/fileMock.js',
        '\\.(css|scss)$': '<rootDir>/config/styleMock.js',
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/stories/**/*',
        '!src/**/*.stories.js',
        '!src/**/*.stories.jsx',
        '!src/**/*.stories.ts',
        '!src/**/*.stories.tsx',
    ],
    transform: {
        '^.+\\.(js|jsx|mjs|cjs)$': '<rootDir>/node_modules/babel-jest',
        '^.+\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest',
        '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
        '^(?!.*\\.(js|jsx|ts|tsx|css|mjs|cjs|json)$)': '<rootDir>/config/jest/fileTransform.js',
    },
    transformIgnorePatterns: ['^.+\\.module\\.(css|sass|scss)$', '<rootDir>/dist/'],
    modulePathIgnorePatterns: [
        '<rootDir>/.storybook/',
        '<rootDir>/dist/',
        '<rootDir>/config/',
        '<rootDir>/node_modules/',
    ],
    watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
    watchPathIgnorePatterns: [
        '<rootDir>/__mocks/',
        '<rootDir>/.storybook/',
        '<rootDir>/dist/',
        '<rootDir>/config/',
        '<rootDir>/coverage/',
        '<rootDir>/node_modules/',
    ],
};
