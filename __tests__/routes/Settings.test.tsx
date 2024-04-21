import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { getUserInformation, getLangPrefOfUser } from '@/lib/actions';
import { redirect, useRouter } from 'next/navigation';
import { act } from 'react-dom/test-utils';
import { faker } from '@faker-js/faker';

jest.mock('@/lib/actions/index.ts', () => ({
	getUserInformation: jest.fn(),
	getLangPrefOfUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	redirect: jest.fn(),
	useRouter: jest.fn(),
}));

import { default as Page } from '@/app/settings/page';

describe('Settings Page', () => {
	let mockRouter: any;

	beforeEach(() => {
		jest.clearAllMocks();
		mockRouter = {
			pathname: '/settings',
			push: jest.fn(),
			refresh: jest.fn(),
		};

		(useRouter as jest.Mock).mockReturnValue(mockRouter);
	});

	jest.doMock('@/lib/actions/index.ts', () => ({
		getUserInformation: jest.fn().mockResolvedValueOnce({
			id: faker.string.uuid(),
			name: faker.person.fullName(),
			email: faker.internet.email(),
			username: faker.internet.userName(),
			image: faker.image.imageUrl(),
		}),
		getLangPrefOfUser: jest.fn().mockResolvedValue('en'),
	}));

	// mock the redirect function
	jest.doMock('next/navigation', () => ({
		redirect: jest.fn(),
	}));

	it('Content renders correctly', async () => {
		const jsx = await Page();

		render(jsx);

		const accountSettingsComp = screen.getByText('Account');
		expect(accountSettingsComp).toBeInTheDocument();

		const languageSettingsComp = screen.getByText('Language');
		expect(languageSettingsComp).toBeInTheDocument();
	});

	it('redirects to login if user is not logged in', async () => {
		getUserInformation.mockResolvedValue(null); // No user logged in

		const jsx = await Page();

		render(jsx);

		await waitFor;
		expect(redirect).toHaveBeenCalledWith('/login');
	});

	it('SettingsNav component within would redirect; ensures that navigation links are correct', async () => {
		const jsx = await Page();
		render(jsx);

		const accountSettingsComp = screen.getByText('Account');
		expect(accountSettingsComp.closest('a')).toHaveAttribute(
			'href',
			'/account',
		);

		const languageSettingsComp = screen.getByText('Language');
		expect(languageSettingsComp.closest('a')).toHaveAttribute(
			'href',
			'/settings/account/language',
		);
	});

	// it('displays all settings items with correct labels', async () => {
	// 	getUserInformation.mockResolvedValue({ id: '123', name: 'Test User' });
	// 	getLangPrefOfUser.mockResolvedValue('english');

	// 	const { findByText } = render(<Page />);
	// 	await findByText('Account');
	// 	await findByText('Notifications');
	// 	await findByText('Appearance');
	// 	await findByText('Language');
	// 	await findByText('Privacy & Security');
	// });

	// it('ensures that navigation links are correct', async () => {
	// 	getUserInformation.mockResolvedValue({ id: '123', name: 'Test User' });
	// 	getLangPrefOfUser.mockResolvedValue('english');

	// 	const { container } = render(<Page />);
	// 	const settingsNav = container.querySelectorAll('.settings-item');
	// 	expect(settingsNav[0].getAttribute('href')).toEqual('settings/account');
	// 	expect(settingsNav[1].getAttribute('href')).toEqual(
	// 		'settings/account/notifications',
	// 	);
	// 	// Continue for other items
	// });
});
