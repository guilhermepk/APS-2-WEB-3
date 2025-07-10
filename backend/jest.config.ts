export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "/src/.*/entities/.*\\.ts$"
    ]
};
