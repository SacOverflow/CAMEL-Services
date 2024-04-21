import { render } from '@testing-library/react';
import PieChart from '@/components/Dashboard/overall_spending_barchart/overall_spending_barchart';
import * as am5 from '@amcharts/amcharts5';
import { getFilteredCategoryPieChart } from '@/lib/actions/dashboard';

jest.mock('@amcharts/amcharts5', () => ({
	Root: {
		new: jest.fn(id => ({
			// Now expecting 'id' to simulate realistic usage
			setThemes: jest.fn(),
			container: {
				children: {
					push: jest.fn(() => ({
						series: {
							push: jest.fn(() => ({
								labels: {
									template: {
										setAll: jest.fn(),
									},
								},
								ticks: {
									template: {
										setAll: jest.fn(),
									},
								},
								data: {
									setAll: jest.fn(),
								},
								appear: jest.fn(),
							})),
						},
					})),
				},
			},
			dispose: jest.fn(), // ensure this is part of the mock to check unmount behavior
		})),
	},
}));
jest.mock('@amcharts/amcharts5/percent', () => ({}));
jest.mock('@amcharts/amcharts5/themes/Animated', () => ({
	new: jest.fn(() => ({})),
}));
jest.mock('@amcharts/amcharts5/themes/Responsive', () => ({
	new: jest.fn(() => ({})),
}));

// use actual implementation of getFilteredCategoryPieChart
jest.mock('@/lib/actions/dashboard', () => ({
	getFilteredCategoryPieChart: jest.fn(() =>
		Promise.resolve([
			{ category: 'Category 1', value: 100 },
			{ category: 'Category 2', value: 200 },
		]),
	),
}));

require('dotenv').config({ path: 'test.env' });
const OLD_ENV = process.env;

beforeAll(() => {
	jest.resetModules(); // Most important - it clears the cache
	process.env = { ...OLD_ENV }; // Make a copy

	jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
	jest.spyOn(console, 'log').mockImplementation(() => {}); // Suppress console.log
});

// Define your teardown logic
afterAll(() => {
	process.env = OLD_ENV; // Restore old environment

	jest.restoreAllMocks();
});

describe('PieChart', () => {
	beforeEach(async () => {
		render(<PieChart className="test-class" />);
	});

	it('renders a chart container', () => {
		const chartContainer = document.querySelector('.test-class');
		expect(chartContainer).toBeInTheDocument();
	});

	it('getFilteredCategoryPieChart returns data of categories and values', async () => {
		const pieChartDataResponse = await getFilteredCategoryPieChart(
			`${process.env.ORG_ID!}`,
		);

		// expect the data to be an array of objects
		expect(pieChartDataResponse).toBeDefined();
		expect(pieChartDataResponse.length).toBeGreaterThan(0);
	});
});
