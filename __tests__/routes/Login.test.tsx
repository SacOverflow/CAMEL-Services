import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '@/app/(auth)/login/page';

require('dotenv').config({ path: 'test.env' });
const userCred = process.env.VALID_USER!;
const userPass = process.env.VALID_PASSWORD!;

import { useRouter } from 'next/navigation';
import { signInUser } from '@/lib/actions/auth.client';
import LoginForm from '@/components/Login/LoginForm';

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));
jest.mock('@/lib/actions/auth.client.ts', () => ({
	signInUser: jest.fn(),
}));

const mockPush = jest.fn();
// Mock successful signInUser
describe('Login', () => {
	beforeEach(() => {
		// Reset the mock implementation before each test
		useRouter.mockReturnValue({
			push: mockPush,
			refresh: jest.fn(),
			pathname: '/login',
			query: {},
			asPath: '/login',
		});
		mockPush.mockClear();

		// Mock for successful signIn
		signInUser.mockImplementation(
			(emailOrUsername: string, password: string) => {
				if (emailOrUsername === userCred && password === userPass) {
					return Promise.resolve({
						data: {
							/* user data */
						},
						error: null,
					});
				}
				// Mock for failed signIn
				return Promise.resolve({
					error: { message: 'Invalid email address or username' },
				});
			},
		);
	});

	it('login renders input for username and password', () => {
		render(<LoginForm />);
		const usernameInput = screen.getByLabelText(
			/email address \/ username/i,
		);
		const passwordInput = screen.getByLabelText(/password/i);
		expect(usernameInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
	});

	// mock loggin in
	it('should sign in successfully with valid credentials', async () => {
		// Render the LoginForm component
		render(<LoginForm />);

		// retrieve the input fields
		const usernameInput = screen.getByLabelText(
			/email address \/ username/i,
		);
		const passwordInput = screen.getByLabelText(/password/i);
		fireEvent.change(usernameInput, { target: { value: userCred } });
		fireEvent.change(passwordInput, { target: { value: userPass } });

		// click the login button
		fireEvent.click(screen.getByRole('button', { name: /login/i }));

		// await async functions / events to complete
		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith('/dashboard');
		});
	});

	// mock failed loggin in
	it('should fail to sign in with invalid credentials', async () => {
		// Render the LoginForm component
		render(<LoginForm />);

		// retrieve the input fields
		const usernameInput = screen.getByLabelText(
			/email address \/ username/i,
		);
		const passwordInput = screen.getByLabelText(/password/i);
		fireEvent.change(usernameInput, { target: { value: 'hello world' } });
		fireEvent.change(passwordInput, { target: { value: 'hello world' } });

		// Simulate form submission
		fireEvent.click(screen.getByRole('button', { name: /login/i }));

		// Wait for async operations and check if the error message is displayed
		await waitFor(() => {
			expect(screen.getByText(/invalid email address or username/i));
		});
	});
});
