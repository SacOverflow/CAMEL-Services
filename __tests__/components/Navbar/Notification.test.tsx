import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Notification from '@/components/Navbar/Notifications';

import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));
const mockPush = jest.fn();
// TEST; test the notification component
describe('Notification component', () => {
	beforeEach(() => {
		// Reset the mock implementation before each test; needed for the last 2 tests
		useRouter.mockReturnValue({
			push: mockPush,
			refresh: jest.fn(),
			pathname: '/',
			query: {},
			asPath: '/',
		});
		mockPush.mockClear();
	});

	it('notification upon click should load notification cards', async () => {
		const { getByRole, getByTitle, getByDisplayValue } = render(
			<Notification />,
		);

		// click the notification button
		const buttonBell = getByRole('button');
		fireEvent.click(buttonBell);

		// await the useEffect to finish
		await waitFor(() => {
			// wait for a div with class of 'notification-container' to be displayed
			const notificationContainer = document.querySelector(
				'.notification-container',
			);
			expect(notificationContainer).toBeInTheDocument();
		});

		// check if the notification cards are displayed
		const notificationCard = document.querySelector('.notification-card');
		expect(notificationCard).toBeInTheDocument();
	});
});
