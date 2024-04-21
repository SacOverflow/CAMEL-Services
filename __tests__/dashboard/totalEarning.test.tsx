import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TotalEarning from '@/components/Dashboard/Total_Earning/TotalEarning';
import { getOrganizationProjectEarnings } from '@/lib/actions/dashboard';
import { faker } from '@faker-js/faker';

jest.mock('@/lib/actions/dashboard', () => ({
	getOrganizationProjectEarnings: jest.fn(),
}));

describe('TotalEarning', () => {
	it('displays earnings correctly when data is fetched', async () => {
		const currentEarningValue = 5000;
		const previousEarningValue = 3000;
		getOrganizationProjectEarnings.mockResolvedValue({
			response: 200,
			currentEarning: currentEarningValue,
			previousEarning: previousEarningValue,
			isPositive: true,
		});

		render(
			<TotalEarning
				org_id={faker.string.uuid()}
				lang="en"
			/>,
		);
		// render(<TotalEarning org_id="1bd976db-0b54-4100-804d-adb023f32da7" lang="en" />);

		// Verify that data is displayed
		await waitFor(() => {
			// get current earning using regex ignoring line breaks (1st col)
			const currentEarning = screen.getByText(
				new RegExp('\\$\\s*5,?000', 'i'),
			);
			expect(currentEarning).toBeInTheDocument();

			// calculate difference percentage to fixed 2 decimal places
			const percentageChange =
				((currentEarningValue - previousEarningValue) /
					previousEarningValue) *
				100;
			const formattedPercentageChange = percentageChange.toFixed(2);

			// assure percentage change is displayed (2nd col)
			const earningChange = screen.getByText(
				new RegExp(`▲\\s*${formattedPercentageChange}%`, 'i'),
			);
			expect(earningChange).toBeInTheDocument();

			// asssure third part of component renders
			const comparedTo = screen.getByText(
				new RegExp(`Compared to \\$\\s*3,?000 last year`, 'i'),
			);
			expect(comparedTo).toBeInTheDocument();
		});
	});

	it('handles division by zero and displays no change correctly', async () => {
		getOrganizationProjectEarnings.mockResolvedValue({
			response: 200,
			currentEarning: 0,
			previousEarning: 0,
			isPositive: null,
		});

		render(
			<TotalEarning
				org_id="org123"
				lang="en"
			/>,
		);

		// Verify handling of zero previous earnings
		await waitFor(() => {
			expect(screen.getByText('$0')).toBeInTheDocument();

			const percentageRegex = new RegExp('○\\s*0\\.?00?\\s*%', 'i');
			expect(screen.getByText(percentageRegex)).toBeInTheDocument();
			expect(
				screen.getByText(/Compared to \$0 last year/),
			).toBeInTheDocument();
		});
	});

	it('displays an error or no-data message when data fetch fails', async () => {
		getOrganizationProjectEarnings.mockResolvedValue({
			response: 404,
		});

		render(
			<TotalEarning
				org_id="org123"
				lang="en"
			/>,
		);

		// Verify that the no data message is displayed
		await waitFor(() => {
			expect(screen.getByText('No data available')).toBeInTheDocument();
		});
	});
});
