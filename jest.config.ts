import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
	coverageProvider: 'v8',
	testEnvironment: 'jsdom',
	// Add more setup options before each test is run
	// setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	moduleDirectories: ['node_modules', '<rootDir>/'],
	verbose: true,
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	setupFiles: ['dotenv/config'],
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coveragePathIgnorePatterns: [
		'<rootDir>/node_modules',
		'<rootDir>/coverage',
		'<rootDir>/jest.config.ts',
		'<rootDir>/jest.setup.ts',
		'<rootDir>/src/types',
		'<rootDir>/src/components/projects/ProjectTasks/ContextProvider',
	],
	coverageReporters: ['json', 'lcov', 'text', 'clover'],
	reporters: [
		'default',
		[
			'./node_modules/jest-html-reporter',
			{
				publicPath: './testReports',
				outputPath: './testReports/testReportsUpdate.html',
				expand: true,
			},
		],
	],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
