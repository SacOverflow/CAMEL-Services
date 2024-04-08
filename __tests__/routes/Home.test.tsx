import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { act } from 'react-dom/test-utils';

describe('Home page', () => {
	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	it('home renders a title of CAMEL', async () => {
		await act(async () => {
			render(<Home />);
		});

		const heading = screen.getByRole('heading', {
			level: 3,
			name: /Cloud Asset Management Enhanced Launcher/i,
		});

		expect(heading).toContainHTML(
			'Cloud Asset Management Enhanced Launcher',
		);
	});

	it('home renders content cards', async () => {
		await act(async () => {
			render(<Home />);
		});

		const cardOne = screen.getByText(
			'Cloud Asset Management Enhanced Launcher (CAMEL)',
		);
		const cardTwo = screen.getByText('All-In-One Dashboard');

		expect(cardOne).toBeInTheDocument();
		expect(cardTwo).toBeInTheDocument();
	});
});
