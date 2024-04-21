import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import NotificationButton from '@/components/Navbar/Notifications';

import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));
const mockPush = jest.fn();
// TEST; test the notification component

jest.mock('@/lib/supabase/client', () => ({
	createSupbaseClient: jest.fn().mockResolvedValue({
		auth: {
			getSession: jest.fn().mockResolvedValue(true), // tbh this isnt needed
			getUser: jest.fn().mockResolvedValue({
				data: {
					user: {
						id: process.env.TESTING_USER_ID,
					},
				},
				error: null,
			}),
		},
		from: jest.fn(() => ({
			select: jest.fn(() => ({
				eq: jest.fn(() => ({
					single: jest.fn().mockResolvedValue({
						data: { id: process.env.TESTING_USER_ID },
						error: null,
					}),
					eq: jest.fn(() => ({
						single: jest.fn().mockResolvedValue({
							data: { id: process.env.TESTING_USER_ID },
							error: null,
						}),
						eq: jest.fn(() => ({
							single: jest.fn().mockResolvedValue({
								data: { id: process.env.TESTING_USER_ID },
								error: null,
							}),
							order: jest.fn(() => ({
								asc: jest.fn(() => ({
									eq: jest.fn(() => ({
										single: jest.fn().mockResolvedValue({
											data: {
												id: process.env.TESTING_USER_ID,
											},
											error: null,
										}),
									})),
								})),
								limit: jest.fn(() => ({
									// resolve the response as array
									data: [
										{
											notification_id: '1',
											title: 'Test Notification',
											message: 'Test Message',
											org_id: '1',
											project_id: '1',
											notification_created_at: new Date(),
											notification_status: 'unread',
											notification_read_at: new Date(),
											user_notification_created_at:
												new Date(),
											type: 'info',
											reference_type: 'project',
											user_id: '1',
										},
										{
											notification_id: '2',
											title: 'Test Notification 2',
											message: 'Test Message 2',
											org_id: '1',
											project_id: '1',
											notification_created_at: new Date(),
											notification_status: 'unread',
											notification_read_at: new Date(),
											user_notification_created_at:
												new Date(),
											type: 'info',
											reference_type: 'project',
											user_id: '1',
										},
									],
									error: null,
								})),
							})),
						})),
					})),
				})),
			})),
		})),
	}),
	getNotifications: jest.fn().mockResolvedValue([
		{
			notification_id: '1',
			title: 'Test Notification',
			message: 'Test Message',
			org_id: '1',
			project_id: '1',
			notification_created_at: new Date(),
			notification_status: 'unread',
			notification_read_at: new Date(),
			user_notification_created_at: new Date(),
			type: 'info',
			reference_type: 'project',
			user_id: '1',
		},
		{
			notification_id: '2',
			title: 'Test Notification 2',
			message: 'Test Message 2',
			org_id: '1',
			project_id: '1',
			notification_created_at: new Date(),
			notification_status: 'unread',
			notification_read_at: new Date(),
			user_notification_created_at: new Date(),
			type: 'info',
			reference_type: 'project',
			user_id: '1',
		},
	]),
}));
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
		// mockPush.mockClear();
	});

	beforeAll(() => {
		// jest.clearAllMocks();
	});

	it('notification upon click should load notification cards', async () => {
		const { getByRole, getByTitle, getByDisplayValue, getByTestId } =
			render(<NotificationButton />);

		// click the notification button
		// const buttonBell = getByRole('button');
		const buttonBell = getByTestId('notification-button');
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
