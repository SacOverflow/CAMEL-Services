import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { act } from 'react-dom/test-utils';

// TEST; Idea for implementing tests for the Home component
describe('Home', () => {
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
});
